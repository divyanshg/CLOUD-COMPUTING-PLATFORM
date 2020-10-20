require('dotenv').config()

const crypto = require('crypto')

let iv = process.env.secure_IV;
let key = process.env.SECURE_KEY


module.exports = {
    encrypt: (data) => {

        let chiper = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = chiper.update(data, 'utf-8', 'hex');
        encrypted += chiper.final('hex')

        return encrypted;

    },
    decrypt: (data) => {

        let dechiper = crypto.createDecipheriv('aes-256-cbc', key, iv)
        let decrypted = dechiper.update(data, 'hex', 'utf-8')
        decrypted += dechiper.final('utf-8')

        return decrypted;

    }
}