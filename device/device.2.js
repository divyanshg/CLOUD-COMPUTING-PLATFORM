require('dotenv').config()
var Device = require('./library/index')
const { Socket } = require('socket.io-client')

Device.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6InVpdWQtNnVpaHUtbml1NTYtbmlvNTQ2LW5vaTY0NS00MzVpdSIsIm93bmVySUQiOiI4OTg0MzU4ODA5Mzg0NTM0NTg5MzUifQ.dv6Cxtms5LgLkoBNlwsAJgmL0y_-WdgZaLNiQutlgSI')
    .then(device => {
        setInterval(() => {
            device.publish({
                deviceID: "uiue-6uihu-niu56-nio546-noi645-435iu",
                feed: "somerandomfeed",
                content: Math.floor(Math.random() * 100).toString(),
                authorId: "uiud-6uihu-niu56-nio546-noi645-435iu"
            })
            //device.logout()
        }, 2000)

    })
    .catch(err => {
        console.error(err)
    })