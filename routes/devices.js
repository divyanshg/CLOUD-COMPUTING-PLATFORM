const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../models/getUser')
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../authorizers/users')

var {
    getDevices,
    getDevice,
    updateDashboardId
} = require('../models/dashboard-render-helper')

router.get('', checkAuthenticated, async (req, res) => {
    res.render('devices/index.ejs', {
        devices: await getDevices(req.user.id)
    })
})

router.get('/:device/:tag', checkAuthenticated, async (req, res) => {
    res.render('devices/device.ejs', {
        owner: req.user.id,
        device: await getDevice(`${req.user.id}/${req.params.device}/${req.params.tag}`)
    })
})

module.exports = router