var dCamp = require('./database')
const {
    encrypt,
    decrypt
} = require('./security')


module.exports = {
    updateLastData: (id, currentValue, ownerID) => {
        return new Promise(async (resolve, reject) => {
            await dCamp.connect()
                .then(async () => dataCamp = await dCamp.get())
                .catch(e => console.log(e))
                
            await dataCamp.collection('feeds').updateOne({
                ownerID,
                id
            }, {
                $set: {
                    lastValue: currentValue
                }
            }, (err, response) => {
                if (err) reject(err)
                dCamp.disconnect()
                resolve(response)
            })
        })
    }
}