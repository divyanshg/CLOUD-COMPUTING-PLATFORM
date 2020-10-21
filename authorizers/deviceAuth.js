var dataCamp = require('../models/database')
var decodeToken = require('jwt-decode');
const jwt = require('njwt')

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
            var {
                deviceID,
                ownerID,
                projectID
            } = ''
            deviceID = decodeToken(token).deviceID
            ownerID = decodeToken(token).ownerID
            projectID = decodeToken(token).projectID

            await dataCamp.findOne({
                id: deviceID,
                ownerID
            }, {
                projection: {
                    _id: 0
                }
            }, (err, device) => {
                if (err) return err
                if (device == null) {
                    reject({
                        code: 404,
                        error: "Invalid Token"
                    })
                } else {
                    jwt.verify(token, device.signature, (err, verifiedJwt) => {
                        if (err) {
                            return reject({
                                code: 404,
                                error: err.message
                            })
                        } else {
                            resolve(device)
                        }
                    })
                }
            })
        })
    }
}