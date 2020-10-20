const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLScalarType,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

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

const DeviceType = new GraphQLObjectType({
    name: "Devices",
    description: "provides Devices",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt)
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
        }
    })
});


const schema = new GraphQLSchema({
    query: RootQueryType
})

module.exports = {
    schema
}