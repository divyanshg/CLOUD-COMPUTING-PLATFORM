
const users = [{
    "id": "898435880938453458935",
    "name": "Divyansh Gupta",
    "email": "divyanshg809@gmail.com",
    "pass": "$2b$10$lQBaEE68GM.03D0mXe6kEOo1M.XMXEnKyMDP9J6KcB4Q2lMIOsFoi"
}]

var dCamp = require('./database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get().collection("users"))
    .catch(e => console.log(e))


function getUserByEmail(email){
    return new Promise(async (resolve, reject) => {
        await dataCamp.findOne({ email }, { projection: { _id:0 } }, (err, user) => {
            if(err) reject(err)
            resolve(user)
        })
    })
}

function getUserById(id) {
    return new Promise(async(resolve, reject) => {
        await dataCamp.findOne({ id }, { projection: { _id:0 } }, (err, user) => {
            if(err) reject(err)
            resolve(user)
        })
    })
}

module.exports = {
    getByEmail: async email => await getUserByEmail(email) ,
    getById: async id => await getUserById(id),
    users: users
}