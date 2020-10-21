const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../models/getUser')
const { checkAuthenticated, checkNotAuthenticated } = require('../authorizers/users')

const { renderDashboard, renderActivity } = require('../view-renderers/dashboard')

const initializePassport = require('../configs/passport-config')

initializePassport(passport)


router.get('/', (req, res) => res.render('./landing/index.ejs'))

router.get('/login', checkNotAuthenticated, (req, res) => res.render('./accounts/login.ejs'))

router.get('/login', checkNotAuthenticated, (req, res) => res.render('./accounts/login.ejs'))

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

//Register Routes

router.get('/register', checkNotAuthenticated, (req, res) => res.render('register.ejs'))

router.post('/register', checkNotAuthenticated, async (req, res) => {

    try {

        const hashedPass = await bcrypt.hash(req.body.pass, 10)

        userFromDB.users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            pass: hashedPass
        })

        res.redirect('/login')

    } catch {

        res.redirect('/register')

    }

    console.log(userFromDB.users)

})

//Logout Route

router.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
})



router.get('/dashboard', checkAuthenticated, renderDashboard)
router.get('/dashboard/connIntro', checkAuthenticated, (req, res) => {
    res.render('create/intro.ejs')
})
router.get('/activity', checkAuthenticated, renderActivity)

router.get('/deviceIcon/:iconsrc', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/icons/'+ req.params.iconsrc)
})

module.exports = router