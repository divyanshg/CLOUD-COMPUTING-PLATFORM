require('dotenv').config()

const {
    Client
} = require('discord.js')
const Device = Client

const device = new Device();

device.on('ready', () => {
    console.log(`Device Connected ${device.user.username} - ${device.user.tag}`)
})

device.on('message', message => {
    console.log(message.author)
    if(message.author == 'YUVRAJVERMAA'){
        message.reply("Keep Quiet")
    }
})

device.login(process.env.DISCORD_TOKEN)