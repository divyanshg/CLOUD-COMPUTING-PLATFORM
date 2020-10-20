const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userFromDB = require('../models/getUser')

const {
    saveLogin,
    saveAccessToken
} = require("../models/saveLoginActivity")
const {
    getLocation
} = require("../models/getUserLocation")
const {
    uuid
} = require('uuidv4');

function initialize(passport) {

    const authenticateUser = async (req, email, password, next) => {
        const user = userFromDB.getByEmail( email )

        if(user == null){
            return next(null, false, { message: 'No user registered with that email!!' })
        }

        try{

            if(await bcrypt.compare(password, user.pass)){
                saveLogin({user: user.uuid, req})
                return next(null, user, )

            }else{
                return next(null, false, { message: 'Password Incorrect' })
            
            }

        } catch(e) {

            return next(e)

        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass',
        passReqToCallback: true
    }, authenticateUser))

    passport.serializeUser((user, next) => next(null, user.id))
    passport.deserializeUser((id, next) => {
        return next(null, userFromDB.getById(id))
    })
}

module.exports = initialize