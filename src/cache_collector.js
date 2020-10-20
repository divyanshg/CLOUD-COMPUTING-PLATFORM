var dCamp = require('../models/database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get().collection("cachedData"))
    .catch(e => console.log(e))

const deleteCache = (deviceID) => {
    return new Promise(async (resolve, reject) => {
        await dataCamp.deleteMany({
            deviceID
        }, (err, response) => {
            if (err) return reject(err)
            resolve(response)
        })
    })
}

module.exports = {
    checkCache: (deviceID) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.find({
                deviceID
            }).toArray(async (err, cache) => {
                if (err) return reject(err)
                await deleteCache(deviceID)
                resolve(cache)
            })
        })
    },
    saveCache: (data) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.insertOne(data, (err, response) => {
                if (err) return reject(err)
                resolve(response)
            })
        })
    }
}