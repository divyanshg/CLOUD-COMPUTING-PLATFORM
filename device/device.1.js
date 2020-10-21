require('dotenv').config()
var Device = require('./library/index')

Device.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6InVpdWUtNnVpaHUtbml1NTYtbmlvNTQ2LW5vaTY0NS00MzVpdSIsIm93bmVySUQiOiI4OTg0MzU4ODA5Mzg0NTM0NTg5MzUiLCJwcm9qZWN0SUQiOiIyOTM1MjI2MTcifQ.WY10anu_bPqXfLzY1NAw_20iciz--ziIrcwnK_Z2kDA')
    .then(device => {
        device.subscribe('Fan Speed', message => {
            console.log(message)
        })
    })
    .catch(err => {
        console.error(err)
    })