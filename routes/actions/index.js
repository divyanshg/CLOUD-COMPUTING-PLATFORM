const express = require('express')
const router = express.Router()

const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../authorizers/users')

const {
    createProject,
    getProjects,
    getProject
} = require('../../models/projects')

const { getAction, allActions, executeAction } = require('../../models/actions/index')

router.get('/:projectID', checkAuthenticated, async (req, res) => res.render('./actions/index.ejs', {
    user: req.user,
    projectID: req.params.projectID,
    project: await getProject(req.params.projectID),
    projects: await getProjects(req.user.id),
    actions: [{
            id: "n5ion5o",
            title: "Mail me when water tank is full",
            status: "CONNECTED",
            endPoint: "assistant",
        },
        {
            id: "dfd8fe",
            title: "Turn on hallway lights when pizza arrives",
            status: "DISCONNECTED",
            endPoint: "phillips",
        }
    ]
}))

router.get('/:actionId/:projectID', checkAuthenticated, async (req, res) => {
    await executeAction(req.params.actionId, req.params.projectID)
    res.render('./actions/action.ejs', {
        user: req.user,
        projectID: req.params.projectID,
        action: await getAction()
    })
})

module.exports = router;