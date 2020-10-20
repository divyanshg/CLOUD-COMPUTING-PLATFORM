var dataCamp = require('../models/database')
var decodeToken = require('jwt-decode');

const {
    encrypt,
    decrypt
} = require('../models/security')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get().collection('devices'))
    .catch(e => console.log(e))


module.exports = {
    authorizeDevice: (token) => {
        return new Promise(async (resolve, reject) => {
            var { deviceID, ownerID } = ''
            try {
                deviceID = decodeToken(token).deviceID
                ownerID = decodeToken(token).ownerID
            } catch (e) {
                return reject({
                    code: 404,
                    error: "Invalid Token"
                })
            }

            await dataCamp.findOne({
                id: deviceID,
                ownerID
            }, {
                projection: {
                    _id: 0
                }
            }, (err, device) => {
                if (err) return err
                if (device == null) reject({
                    code: 404,
                    error: "Invalid Token"
                })
                resolve(device)
            })
        })
    }
}