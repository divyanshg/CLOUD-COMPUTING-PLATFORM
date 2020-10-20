var dCamp = require('./database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get())
    .catch(e => console.log(e))

module.exports = {
    getDevices: async (ownerID) => {
        return new Promise(async (resolve, reject) => {
            
            await dataCamp.collection('devices').find({
                ownerID
            }, {
                projection: {
                    _id: 0
                }
            }).toArray((error, devices) => {
                if(error) reject(error)
                //dCamp.disconnect()
                resolve(devices)
            })
        })
    },
    getDevice: async (deviceTofind) => {
        const ownerID = deviceTofind.split('/')[0]
        const name = deviceTofind.split('/')[1]
        const tag = deviceTofind.split('/')[2]

        return new Promise(async (resolve, reject) => {

            await dataCamp.collection('devices').findOne({
                ownerID,
                name,
                tag
            }, {
                projection: {
                    _id: 0
                }
            }, (error, device) => {
                if (error) reject(error)
                //dCamp.disconnect()
                resolve(device)
            })
        })
    }
}