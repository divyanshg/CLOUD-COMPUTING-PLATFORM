const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../../models/getUser')
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../authorizers/users')

const {
    saveDevice
} = require('./single-register')
const {
    addToQueue,
    getActivities
} = require('../../models/bulk-register')

const {
    registerPolicy
} = require('../../models/policy.js')

const {
    getDeviceTypes,
    createDeviceType
} = require('./deviceType')

const {
    createProject,
    getProjects,
    getProject
} = require('../../models/projects')



router.get('/', checkAuthenticated, (req, res) => {
    res.redirect('/dashboard')
})

router.get('/provisioning/:projectID', checkAuthenticated, async (req, res) => {
    res.render('create/provisioning.ejs', {
        projectID: req.params.projectID, 
        project: await getProject(req.params.projectID),
        projects: await getProjects(req.user.id)
    })
})

router.get('/single-provision/:projectID', checkAuthenticated, async (req, res) => {
    res.render("create/single-provision.ejs", {
        ownerID: req.user.id,
        projectID: req.params.projectID, 
        project: await getProject(req.params.projectID),
        projects:await getProjects(req.user.id),
        deviceTypes: await getDeviceTypes(req.user.id, req.params.projectID)
    });
})

router.post('/single-device/:projectID', checkAuthenticated, async (req, res) => {
    delete req.user.pass;
    await saveDevice({
            user: req.user,
            device: req.body,
            projectID: req.params.projectID
        })
        .then(resp => {
            res.sendStatus(200)
        })
        .catch(e => {
            res.sendStatus(500)
        })
})

router.get('/bulk-provisions/:projectID', checkAuthenticated, async (req, res) => {
    res.render('create/bulk-provisions.ejs', {
        projectID: req.params.projectID, 
        project: await getProject(req.params.projectID),
        projects: await getProjects(req.user.id)
    })
})

router.post('/bulk-provisions/:projectID', checkAuthenticated, addToQueue)

router.get('/policy/:projectID', checkAuthenticated, async (req, res) => {
    res.render('policy/new.ejs', {
        owner: req.user.id, 
        project: await getProject(req.params.projectID),
        projectID: req.params.projectID,
        projects: await getProjects(req.user.id)
    })
})

router.get('/project', checkAuthenticated, (req, res) => {
    delete req.user.pass;
    res.render('create/project.ejs', { user: req.user })
})

router.post('/project', checkAuthenticated, createProject)

router.post('/policy/:projectID', checkAuthenticated, registerPolicy)

router.post('/device-type/:projectID', checkAuthenticated, createDeviceType)

module.exports = router