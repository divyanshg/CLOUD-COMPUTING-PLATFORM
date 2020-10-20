const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLScalarType,
    GraphQLInt,
    GraphQLNonNull,
    FieldsOnCorrectTypeRule
} = require('graphql')

var dCamp = require('../../models/database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get())
    .catch(e => console.log(e))


const {
    v4
} = require('uuid')

const jwt = require('jsonwebtoken')

const devices = [{
    "_id": {
        "$oid": "5f4502297687c17831967354"
    },
    "id": "uiue-6uihu-niu56-nio546-noi645-435iu",
    "token": "NzQ3NzczMjUxNzM5OTc1NzUx.X0TwHA.AhPU8rFEb7zu3ncbJwLTDB7WppY",
    "name": "Ceiling Fan",
    "icon": "uiue-6uihu-niu56-nio546-noi645-435iu",
    "region": "india",
    "feedCount": {
        "$numberInt": "2"
    },
    "createdTimestamp": {
        "$timestamp": {
            "t": 0,
            "i": 2818114330
        }
    },
    "description": "Device Description",
    "ownerID": "898435880938453458935",
    "status": true,
    "connectionId": "KHMhFlE548DNlXwaAAAF",
    "ip": "192.168.31.1",
    "lastOnline": "Sun Sep 20 2020 22:52:44 GMT+0530 (India Standard Time)"
}]

var foundfeeds = []

const DeviceType = new GraphQLObjectType({
    name: "Devices",
    description: "provides Devices",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        icon: {
            type: GraphQLNonNull(GraphQLString)
        },
        region: {
            type: GraphQLNonNull(GraphQLString)
        },
        feedCount: {
            type: GraphQLNonNull(GraphQLInt),
            resolve: (device) => {
                return device.feedCount['$numberInt']
            }
        },
        description: {
            type: GraphQLNonNull(GraphQLString)
        },


        /*
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }*/
    }),
});

const FeedType = new GraphQLObjectType({
    name: "Feeds",
    description: "Provides Feeds",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        device: {
            type: GraphQLNonNull(GraphQLString)
        },
        ownerID: {
            type: GraphQLNonNull(GraphQLString)
        },
        dataType: {
            type: GraphQLNonNull(GraphQLString)
        },
        createdTimestamp: {
            type: GraphQLNonNull(GraphQLString)
        },
        lastValue: {
            type: GraphQLNonNull(GraphQLString)
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        device: {
            type: DeviceType,
            description: "Single device",
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve: (parent, args) => devices.find(device => device.id === args.id)
        },
        devices: {
            type: new GraphQLList(DeviceType),
            description: "List of Devices",
            resolve: () => devices
        },
        feeds: {
            type: FeedType,
            description: "Device Feeds",
            args: {
                device: {
                    type: GraphQLString
                },
                feedId: {
                    type: GraphQLString
                }
            },
            resolve: async (parent, args) =>  feeds.find(feed => feed.device === args.device)
        }
    })
});

const rootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addDevice: {
            type: DeviceType,
            description: "Add a device",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                deviceType: {
                    type: GraphQLString
                },
                deviceGroup: {
                    type: GraphQLString
                },
                ownerId: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (parent, {
                name,
                deviceType,
                deviceGroup,
                ownerId
            }) => {
                const deviceId = v4();
                const device = {
                    "id": deviceId,
                    "token": generateAccessToken(deviceId, ownerId),
                    name,
                    deviceType,
                    deviceGroup,
                    "icon": deviceId,
                    "createdTimestamp": Date.now(),
                    "ownerID": "898435880938453458935"
                }
                return device
            }
        },
        addFeed: {
            type: FeedType,
            description: "Add feeds",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                dataType: {
                    type: GraphQLNonNull(GraphQLString)
                },
                device: {
                    type: GraphQLNonNull(GraphQLString)
                },
                ownerID: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (parent, {
                name,
                dataType,
                device,
                ownerID
            }) => {
                const id = `feed_${v4()}`
                const feed = {
                    id,
                    name,
                    dataType,
                    device,
                    ownerID,
                    createdTimestamp: Date.now()
                }
                return feed
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: rootMutationType
})

function generateAccessToken(deviceID, ownerID) {
    return jwt.sign({
        deviceID,
        ownerID
    }, process.env.SECRET_key);
}

function get_feeds(args) {
    return new Promise(async (resolve, reject) => {
        await dataCamp.collection('feeds').find({
            $or: [{
                device: args.device
            }, {
                id: args.feedId
            }]
        }).toArray((err, feeds) => {
            if (err) return
            console.log(feeds)
            foundfeeds.push(feeds)
            resolve({
                feeds
            })
        })
    })
}

module.exports = {
    schema
}