var dCamp = require('./database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get().collection("Projects"))
    .catch(e => console.log(e))


module.exports = {
    getProjects: (ownerID) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.find({ ownerID }, { projection: { _id:0, name:1, id:1 } }).toArray((err, projects) => {
                if(err) reject(err)
                resolve(projects)
            })
        })
    },
    getProject: (id) => {
        return new Promise(async (resolve, reject) => {
            await dataCamp.findOne({ id }, (err, project) => {
                if(err) reject(err)
                resolve(project)
            })
        })
    }
}