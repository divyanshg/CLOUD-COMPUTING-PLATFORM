if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const SERVER_ID = process.env.SERVERID

const express = require('express')

const expressGraphQL = require("express-graphql").graphqlHTTP;
const publicGraphQLAPI = require('../routes/graphQL/index')
const internalGraphQLAPI = require('../routes/graphQL/internal_API')

const app = express()
const methodOverride = require('method-override')

var http = require('http').createServer(app);
var io = require('socket.io')(http);

const session = require('express-session')
const passport = require('passport')
const flash = require('express-flash')

const {
    redis,
    publisher,
    subscriber
} = require("../configs/redis-config")

const port = process.env.PORT || 80

const {
    v4
} = require('uuid')

const {
    authorizeDevice,
    checkPolicies
} = require('../authorizers/deviceAuth')

const {
    getFeedInfo,
    getDeviceinfo,
    getAuthorInfo,
    getDashboardInfo
} = require('../models/messageGenerator')

const {
    updateLastData
} = require('../models/feeds')

const {
    saveMessage,
    updateDeviceStatus
} = require('../models/activityTrackers')

const {
    checkCache,
    saveCache
} = require('./cache_collector');
const {
    checkAuthenticated
} = require('../authorizers/users');

//View Engine

app.set('view-engine', 'ejs')

app.use(express.urlencoded({
    extended: false
}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.json())
// Routes

app.use('/', require('../routes/index'))
app.use('/create', require('../routes/create/index'))
app.use('/policy', require('../routes/policy/index'))
app.use('/devices', require('../routes/devices'))
app.use('/api', require('../routes/api/index'))
app.use('/integrations', require("../routes/integrations/index"))

app.use(express.static('resources'))
app.use('/resources', express.static(__dirname + '/resources'));

//GraphQL API

app.use('/api', expressGraphQL({
    schema: publicGraphQLAPI.schema,
    graphiql: true
}))

app.use('/internals', checkAuthenticated, expressGraphQL({
    schema: internalGraphQLAPI.schema,
    graphiql: true
}))


io.on('connection', (socket) => {

    //Redis Subscriptions

    subscriber.on("device_connected", (channel, loginStatus) => {
        loginStatus = JSON.parse(loginStatus)
        if (loginStatus.SERVER_ID == SERVER_ID) return
        console.log("device_connected_recieved")
        loginDevice(io, socket, loginStatus.device)
    })

    subscriber.on("data_publish", (channel, incomingData) => {
        const { data, SERVER_ID } = JSON.parse(incomingData)
        if (SERVER_ID == SERVER_ID) return
        console.log("data_publsih_recieved")
        console.log(data)
    })

    subscriber.on("publish_err", (channel, incomingData) => {
        const { author, policy, SERVER_ID } = JSON.parse(incomingData)
        if (SERVER_ID == SERVER_ID) return
        io.to(author).emit('publish_err', "Publish was not allowed by device policies.\nPolicy : " + policy)
    })

    socket.on('login', (token) => {
        authorizeDevice(token)
            .then(async device => {

                loginDevice(io, socket, device, token)

            })
            .catch(async err => {
                await socket.emit(`login-status-${token}`, err)
                socket.disconnect()
            })
    })

    socket.on('login_dash', (ownerID) => {
        socket.join(`dashboard_${ownerID}_iot`)
    })

    socket.on('dash_publish', async data => {

        if (typeof io.sockets.adapter.rooms["dashboard_" + data.authorId + "_iot"] == 'undefined') return
        if (!io.sockets.adapter.rooms["dashboard_" + data.authorId + "_iot"].sockets[socket.id]) return


        const {
            author,
            owner
        } = await getAuthorInfo(data.deviceID, false)



        const formattedData = {
            feed,
            id: v4(),
            type: typeof data.content,
            content: data.content,
            author: {
                name: "IOT DASHBOARD",
                isDevice: false,
                dashboardInfo: await getDashboardInfo(data.dashboardId)
            },
            createdTimestamp: data.timeStamp
        }


        //io.to(data.deviceID).emit(feed.name, formattedData)
        //io.to(data.deviceID).emit(feed.id, formattedData)
        io.to(`dashboard_${device.ownerID}_iot`).emit('published', formattedData)

        formattedData.author.address = socket.handshake.address.replace('::ffff:', '')
        formattedData.author.time = socket.handshake.time
        formattedData.author.dashboardId = data.dashboardId
        await saveMessage(formattedData)
    })

    socket.on('publish', async data => {

        await checkPolicies(data.authorId, "Publish").then(async d => {
                if (typeof io.sockets.adapter.rooms[data.authorId] == 'undefined') return
                if (!io.sockets.adapter.rooms[data.authorId].sockets[socket.id]) return


                publisher.publish("data_publish",JSON.stringify({
                    data,
                    SERVER_ID
                }))
                // const feed = await getFeedInfo(data.feed),
                //     device = await getDeviceinfo(data.deviceID),
                //     {
                //         author,
                //         owner
                //     } = await getAuthorInfo(data.authorId, data.isDevice)

                // if (owner != device.ownerID) return

                // feed.contentTypeMatches = (feed.dataType == typeof data.content)

                // delete device.signature;
                // delete device.policies;

                // if (feed.contentTypeMatches) {
                //     //publishData(data, feed, device, author, owner, socket)
                // } else {
                //     io.to(data.authorId).emit(`invalid_data_type_sent`, {
                //         feed: data.feed,
                //         acceptedType: feed.dataType,
                //         sentType: typeof data.content
                //     })
                //     return
                // }
            })
            .catch(policy => {
                io.to(data.authorId).emit('publish_err', "Publish was not allowed by device policies.\nPolicy : " + policy)
                publisher.publish("publish_err", JSON.stringify({
                    author: data.authorId,
                    policy,
                    SERVER_ID
                }))
                return
            })

    })

    socket.on('disconnect', async () => {
        var device = await updateDeviceStatus(socket.id, '', socket.handshake, false)
        try {
            if (device == null) return

            delete device.signature;
            delete device.policies;

            io.to(`dashboard_${device.ownerID}_iot`).emit('device_disconnected', device)
            delete io.sockets.adapter.rooms[socket.id];
        } catch (e) {
            return
        }
    })

});

async function loginDevice(io, socket, device, token) {
    if (typeof io.sockets.adapter.rooms[device.id] == 'undefined') {
        socket.join(device.id)
    } else {
        socket.disconnect()
        //device.serverID = SERVER_ID
        io.to(`dashboard_${device.ownerID}_iot`).emit('invalid_access_rejected', {
            device,
            SERVER_ID,
            error: "Another device tried to login with same credentials."
        })
        return
    }

    device.ip = socket.handshake.address.replace('::ffff:', '')
    device.status = true

    delete device.signature;
    delete device.policies;

    var loginStatus = {
        code: 200,
        error: null,
        device,
        SERVER_ID,
    }

    io.to(device.id).emit(`login-status-${token}`, loginStatus)
    io.to(device.id).emit(`login_status_`, loginStatus)

    io.to(`dashboard_${device.ownerID}_iot`).emit('device_online', device)

    //Publishing to redis

    loginStatus.broadcastTo = `dashboard_${device.ownerID}_iot`
    publisher.publish("device_connected", JSON.stringify(loginStatus))

    await updateDeviceStatus(socket.id, device.id, socket.handshake, true)

    await clearCaches(device.id, socket)
}

async function clearCaches(deviceId, socket) {
    var cache = await checkCache(deviceId)

    if (cache.length != 0) {
        await cache.forEach(async data => {
            const feed = await getFeedInfo(data.feed),
                device = await getDeviceinfo(data.deviceID)
            var author = null,
                owner = null

            if (device.ownerID == data.authorId) {

                const {
                    author_dummy_notUsed,
                    owner_
                } = await getAuthorInfo(data.deviceID, false)
                author = {
                    name: "IOT DASHBOARD",
                    isDevice: false,
                    dashboardInfo: await getDashboardInfo(data.dashboardId)
                }
                owner = owner_

                delete device.signature;
                delete device.policies;

                publishData(data, feed, device, author, owner, socket)

            } else if (owner != device.ownerID) {
                return
            } else {
                const {
                    author,
                    owner
                } = await getAuthorInfo(data.authorId)

                delete device.signature;
                delete device.policies;

                publishData(data, feed, device, author, owner, socket)
            }
        })
    }

    delete cache;
}

async function publishData(data, feed, device, author, owner, socket) {
    await updateLastData(data.feed, data.content, device.ownerID)

    const formattedData = {
        feed,
        device,
        id: v4(),
        type: typeof data.content,
        content: data.content,
        author,
        createdTimestamp: data.timeStamp
    }

    delete device.signature;
    delete device.policies;

    io.to(data.deviceID).emit(feed.name, formattedData)
    io.to(data.deviceID).emit(feed.id, formattedData)
    io.to(`dashboard_${device.ownerID}_iot`).emit('published', formattedData)

    formattedData.author.address = socket.handshake.address.replace('::ffff:', '')
    formattedData.author.time = socket.handshake.time
    await saveMessage(formattedData)
}

http.listen(3000, () => {
    console.log('listening on *:3000');
});