var dataCamp = require('./database')
const {
    encrypt,
    decrypt
} = require('./security')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get())
    .catch(e => console.log(e))

module.exports = {
    getFeedInfo: (id) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.collection('feeds').findOne({
                id
            }, {
                projection: {
                    _id: 0,
                    dataType: 1,
                    id: 1,
                    name: 1,
                    lastValue: 1
                }
            }, (err, feedInfo) => {
                if (err) return resolve({
                    error: "Feed Not Found"
                })
                if (feedInfo == null) return resolve({
                    error: "Feed Not Found"
                })
                resolve(feedInfo)
            })
        })
    },
    getDeviceinfo: (id) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.collection('devices').findOne({
                id
            }, {
                projection: {
                    _id: 0,
                    token: 0,
                    status: 0,
                    connectionId: 0,
                    ip: 0,
                    lastOnline: 0
                }
            }, (err, deviceInfo) => {
                if (err) return resolve({
                    error: "Device Not Found"
                })
                if (deviceInfo == null) return resolve({
                    error: "Device Not Found"
                })
                resolve(deviceInfo)
            })
        })
    },
    getAuthorInfo: (id, isDevice) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.collection('devices').findOne({
                id
            }, {
                projection: {
                    _id: 0,
                    name: 1,
                    id: 1,
                    ownerID: 1
                }
            }, (err, authorInfo) => {
                if (err) return resolve({
                    error: "Author Not Found"
                })
                if (authorInfo == null) return resolve({
                    error: "Author Not Found"
                })

                author = {
                    id: authorInfo.id,
                    name: authorInfo.name,
                    device: isDevice
                }

                resolve({
                    author,
                    owner: authorInfo.ownerID
                })
            })
        })
    },
    getDashboardInfo: (session) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.collection("loginActivity").findOne({ session }, { projection: { _id:0, ip: 0, session:0 }} ,(err, info) => {
                if (err) return resolve({
                    error: "Dashboard instance Not Found"
                })
                if (info == null) return resolve({
                    error: "Dashboard instance Not Found"
                })
                resolve(info)
            })
        })
    }
}