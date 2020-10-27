var dataCamp = require('../models/database')
var decodeToken = require('jwt-decode');
const jwt = require('njwt')

const {
    encrypt,
    decrypt
} = require('../models/security');
const feeds = require('../models/feeds');

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get())
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

            await dataCamp.collection('devices').findOne({
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
    },
    checkPolicies: (author, device, checkFor) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.collection('devices').findOne({
                id: author
            }, {
                projection: {
                    _id: 0,
                    policies: 1
                }
            }, (err, device) => {
                if (err) reject(err)

                var policies = device.policies

                policies.forEach(async policy => {
                    await dataCamp.collection("policies").findOne({
                        resource: policy
                    }, {
                        projection: {
                            _id: 0,
                            policy: 1
                        }
                    }, (err, policy) => {
                        if (err) console.log(err);

                        var statements = policy.policy.Statement;
                        var allowedActions = statements.find(stmt => stmt.Effect == "Allow")

                        allowedActions.Action.forEach(action => {
                            if (action.search(checkFor) != -1) {
                                resolve("OK")
                            }else{
                                reject("ERR")
                            }
                        })
                    })
                })
            })
        })
    }
}