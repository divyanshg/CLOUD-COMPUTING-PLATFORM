var socket = require('socket.io-client');
const chalk = require('chalk');

var wasLoggedIn = false;
var deviceInfo;
var lastToken = ''
var loggedOut = false

socket = socket('http://iotine.zapto.org')

socket.on('disconnect', (s) => {
    //console.clear() 
    console.log("Disconnected From Server\nTrying to reconnect...")
    console.log(s)
    process.exit(0)
});

socket.on('error', (e) => console.log(e))

socket.on(`invalid_data_type_sent`, details => {
    console.log(chalk.bgRed(`Invalid data type was sent to ${details.feed} \nAccepted Type: ${details.acceptedType} \nSent: ${details.sentType} \nData was not sent to target device! `) + "\n")
})

function login(token) {
    return new Promise(async (resolve, reject) => {
        await socket.emit('login', token)
        await socket.on(`login-status-${token}`, async status => {
            try {
                if (status.code == 404) {
                    wasLoggedIn = false
                    console.error(`Error: ${chalk.bgRed(status.error)}`)
                } else {
                    wasLoggedIn = true
                    lastToken = token
                    console.log(status.device.name, " - " + chalk.bgGreen(" Login successfull "))
                    console.log(chalk.yellow(status.device.lastOnline))
                    var deviceRegion = status.device.region
                    console.log("REGION : " + chalk.bgBlue(` ${deviceRegion.toUpperCase()} `))
                    console.log("IP (on server) : ", chalk.yellowBright(status.device.ip))

                    const device = {
                        info: status.device,
                        subscribe: async (event, callback) => await socket.on(event, callback),
                        publish: async (data) => {
                            data.timeStamp = Date.now()
                            data.isDevice = true
                            await socket.emit('publish', data)
                        },
                        logout: () => {
                            console.clear()
                            console.log(chalk.bgRed(" Device Logged Out "))
                            process.exit(0)
                        }
                    }

                    deviceInfo = device

                    resolve(device)
                }
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    login: async (token) => await login(token)
}