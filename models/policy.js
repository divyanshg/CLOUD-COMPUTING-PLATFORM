const {
    uuid
} = require('uuidv4');

var dataCamp = require('./database')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get().collection("policies"))
    .catch(e => console.log(e))


module.exports = {
    registerPolicy: (req, res) => {
        var Statement = []
        
        for(var i =0; i < req.body.statement.length; i++){
            var statement = req.body.statement[i]
            var template = {
                Effect: req.body[`effect-${i+1}`],
                Action: req.body.statement[i].split(','),
            }
            Statement.push(template)
        }

        var policy = {
            owner: req.user.id,
            policy:{
                name: req.body.name,
                createdOn: Date.now(),
                Statement
            },
            resource: `RN::${uuid()}`
        }

        dataCamp.insertOne(policy, (err, response) => {
            if(err) return
            res.redirect("/policy")
        })
    },
    getPolicies: (owner, projection) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.find({ owner }, { projection }).toArray((err, policies) => {
                if(err) reject(err)
                resolve(policies)
            })
        })
    },
    getPolicyInfo: (owner, resource) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.findOne({
                owner,
                resource
            }, {
                projection:{
                    _id:0
                }
            }, (err, policy) => {
                if (err) reject(err)
                resolve(policy)
            })
        })
    }
}