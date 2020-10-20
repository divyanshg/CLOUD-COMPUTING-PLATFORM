var dCamp = require('./database')
var dataCamp;

const {
    encrypt,
    decrypt
} = require('./security')

module.exports = {
    saveMessage: (message) => {
        return new Promise(async (resolve, reject) => {
            await dCamp.connect()
                .then(async () => dataCamp = await dCamp.get())
                .catch(e => console.log(e))

            await dataCamp.collection('messages').insertOne(message, (err, response) => {
                if (err) reject(err)
                dCamp.disconnect()
                resolve(response)
            })
        })
    },
    updateDeviceStatus: (socketId, deviceId, handshake, status) => {
        return new Promise(async (resolve, reject) => {
            await dCamp.connect()
                .then(async () => dataCamp = await dCamp.get())
                .catch(e => console.log(e))

            await dataCamp.collection('devices').updateOne({
                $or:[
                    {
                        id: deviceId
                    },
                    {
                        connectionId: socketId
                    }
                ]
            }, {
                $set: {
                    connectionId: socketId,
                    status,
                    lastOnline: handshake.time,
                    ip: handshake.address.replace('::ffff:', '')
                }
            }, async (err, resp) => {
                if (err) reject(err)
                //dCamp.disconnect()
                resolve(await dataCamp.collection('devices').findOne({
                    $or: [{
                            id: deviceId
                        },
                        {
                            connectionId: socketId
                        }
                    ]
                }))
            })
        })
    }
}