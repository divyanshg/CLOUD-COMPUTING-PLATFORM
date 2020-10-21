var dCamp = require('../../models/database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get().collection("deviceTypes"))
    .catch(e => console.log(e))

const {
    v4
} = require('uuid')

module.exports = {
    getDeviceTypes: (ownerID, projectID) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.find({
                ownerID,
                projectID
            }, {
                projection: {
                    _id: 0,
                    name: 1,
                    resource: 1
                }
            }).toArray((err, deviceTypes) => {
                if (err) reject(err)
                resolve(deviceTypes)
            })
        })
    },
    createDeviceType: async (req, res) => {
        var resource = `RN:${v4()}`;
        await dataCamp.insertOne({
            name: req.body.name,
            ownerID: req.user.id,
            projectID: "293522617",
            resource
        }, (err, resp) => {
            if (err) res.sendStatus(500);
            res.send({resource})
        })
    }
}