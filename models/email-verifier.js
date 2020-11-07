if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env._EMAIL,
    pass: process.env._EMAIL_PASS
  }
});

module.exports = {
    sendVerifier: (to) => {
        var mail = {
            from: process.env._EMAIL,
            to,
            subject: "Verify your email address",
            
        }
    },
    updateEmailStatus: (req, res) => {

    }
}