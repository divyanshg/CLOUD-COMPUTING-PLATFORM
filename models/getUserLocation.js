const axios = require('axios')

module.exports = {
    getLocation: async (ip) => {
        ip = ip.replace("::ffff:", "")
        await axios.get(`http://api.ipstack.com/${ip}?access_key=1a8c50e55cf783fa5e4fb47287a12b13`)
        .then(locationInfo => {
            console.log(locationInfo.data)
        }) 
    }
}