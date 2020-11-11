const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../models/getUser')
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../authorizers/users')

const {
    renderDashboard,
    renderActivity
} = require('../view-renderers/dashboard')
const {
    getProjects
} = require('../models/projects')
const initializePassport = require('../configs/passport-config')
const {
    exec
} = require('child_process');

initializePassport(passport)


router.get('/', (req, res) => res.render('./landing/sample.ejs'))

router.get('/login', checkNotAuthenticated, (req, res) => res.render('./accounts/login.ejs'))

router.get('/login', checkNotAuthenticated, (req, res) => res.render('./accounts/login.ejs'))

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/projects',
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

router.get('/projects', checkAuthenticated, async (req, res) => {
    res.render("projects/index.ejs", {
        projects: await getProjects(req.user.id)
    })
})

router.get('/project/:id', checkAuthenticated, async (req, res) => {
    req.user.project = req.params.id
    res.redirect('/dashboard/'+req.params.id)
    //renderDashboard(req, res)
    //res.render('services/index.ejs', { projectID: req.params.id })
})

router.get('/dashboard/:projectID', checkAuthenticated, renderDashboard)
router.get('/dashboard/connIntro/:projectID', checkAuthenticated, (req, res) => {
    res.render('create/intro.ejs', { projectID: req.params.projectID })
})
router.get('/activity/:projectID', checkAuthenticated, renderActivity)

router.get('/deviceIcon/:iconsrc', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/icons/' + req.params.iconsrc)
})



module.exports = router