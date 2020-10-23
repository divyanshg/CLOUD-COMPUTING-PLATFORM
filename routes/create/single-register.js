var dCamp = require('../../models/database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get().collection("devices"))
    .catch(e => console.log(e))

const jwt = require('njwt')

const {
    v4
} = require('uuid')

module.exports = { 
    saveDevice: ({user, device}) => {
        return new Promise(async (resolve, reject) => {
            const id = v4();
            const signature = v4()

            const claims = { deviceID: id, ownerID: user.id, projectID: '293522617' }

            const token = jwt.create(claims, signature)

            await dataCamp.insertOne({ id, name: device.name, feedCount: device.feeds.length, ownerID: user.id, signature, type: device.type, group: device.group, token: token.toString() }, (err, resp) => {
                if(err) reject(err)
                resolve(resp)
            })
        })
    }
}