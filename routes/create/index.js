const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../../models/getUser')
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../authorizers/users')

const { addToQueue, getActivities } = require('../../models/bulk-register')

const { registerPolicy } = require('../../models/policy.js')

const { getDeviceTypes, createDeviceType } = require('./deviceType')

router.get('/', checkAuthenticated, (req, res) => {
    res.redirect('/dashboard')
})

router.get('/provisioning', checkAuthenticated, (req, res) => {
    res.render('create/provisioning.ejs')
})

router.get('/single-provision', checkAuthenticated, async (req, res) => {
    res.render("create/single-provision.ejs", {
      ownerID: "898435880938453458935",
      deviceTypes: await getDeviceTypes(req.user.id, '293522617')
    });
})

router.get('/bulk-provisions', checkAuthenticated, (req, res) => {
    res.render('create/bulk-provisions.ejs')
})

router.post('/bulk-provisions', checkAuthenticated, addToQueue)

router.get('/policy', checkAuthenticated, (req, res) => {
    res.render('policy/new.ejs', {
        owner: req.user.id
    })
})

router.post('/policy', checkAuthenticated, registerPolicy)

router.post('/device-type', checkAuthenticated, createDeviceType)

module.exports = router