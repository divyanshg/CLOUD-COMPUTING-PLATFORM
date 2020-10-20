require('dotenv').config()
var Device = require('./library/index')

Device.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6InVpdWUtNnVpaHUtbml1NTYtbmlvNTQ2LW5vaTY0NS00MzVpdSIsIm93bmVySUQiOiI4OTg0MzU4ODA5Mzg0NTM0NTg5MzUifQ.OjQKim5GNF9SpgIk4IFQYlq0M6F6Hn6goKyKcQIgfhg')
    .then(device => {
        device.subscribe('Fan Speed', message => {
            console.log(message)
        })
    })
    .catch(err => {
        console.error(err)
    })