const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../models/getUser')
const usersAuthorizer = require('../authorizers/users') 

const initializePassport = require('../configs/passport-config')

initializePassport(passport)


router.get('/', (req, res) => res.render('index.ejs'))

//Login Routes

router.get('/login', usersAuthorizer.checkNotAuthenticated, (req, res) => res.render('login.ejs'))

router.post('/login', usersAuthorizer.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/console',
    failureRedirect: '/login',
    failureFlash: true
}))

//Register Routes

router.get('/register', usersAuthorizer.checkNotAuthenticated, (req, res) => res.render('register.ejs'))

router.post('/register', usersAuthorizer.checkNotAuthenticated, async (req, res) => {

    try{

        const hashedPass = await bcrypt.hash(req.body.pass, 10)

        userFromDB.users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            pass: hashedPass
        })

        res.redirect('/login')

    } catch{

        res.redirect('/register')

    }

    console.log(userFromDB.users)

})

//Logout Route

router.delete('/logout', usersAuthorizer.checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//Other Routes

router.get('/console', usersAuthorizer.checkAuthenticated, (req, res) => res.render('console.ejs', { name: req.user.name }))


module.exports = router