const express = require('express')
const router = express.Router()
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../authorizers/users')
var {
    getDevices,
    getDevice,
    updateDashboardId
} = require('../models/dashboard-render-helper')
router.get('/:projectID', checkAuthenticated, async (req, res) => {
    res.render('devices/index.ejs', {
        devices: await getDevices(req.params.projectID, req.user.id),
        projectID:req.params.projectID
    })
})
router.get('/:device/:tag/:projectID', checkAuthenticated, async (req, res) => {
    res.render('devices/device.ejs', {
        owner: req.user.id,
        device: await getDevice(req.params.projectID,`${req.user.id}/${req.params.device}/${req.params.tag}`),
        projectID:req.params.projectID
    })
})
module.exports = router
