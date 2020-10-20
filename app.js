
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const methodOverride = require('method-override')

const session = require('express-session')
const passport = require('passport')
const flash = require('express-flash')

const port = process.env.PORT || 80

//View Engine

app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session( { secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Routes

app.use('/', require('./routes/index'))


app.listen(port, () => console.log("Vision IOT"))