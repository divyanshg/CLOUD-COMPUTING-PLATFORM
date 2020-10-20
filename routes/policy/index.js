const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const user = require('../../models/getUser')

const {
    getPolicies,
    getPolicyInfo
} = require('../../models/policy.js')
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../authorizers/users')

router.get('/', checkAuthenticated, async (req, res) => {
    res.render('policy/index.ejs', {
        owner: req.user.id,
        policies: await getPolicies(req.user.id, { policy: 1, resource:1 })
    })
})

router.get('/:policy', checkAuthenticated, async (req, res) => {
    res.render('policy/policy.ejs', {
        owner:req.user.id,
        policy:await getPolicyInfo(req.user.id, req.params.policy)
    })
})

module.exports = router