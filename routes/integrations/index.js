const express = require('express')
const router = express.Router()

const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../authorizers/users')

const {
    getProjects,
    getProject
} = require('../../models/projects')

var dCamp = require('../../models/database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get())
    .catch(e => console.log(e))


//Main Page

const {
    getIntegration,
    allIntegrations,
    executeIntegration
} = require('../../models/integrations/index')

//GMAIL INTEGRATIONS

const gmailIntegrator = require("../../src/integrations/gmail/index")

router.get('/service/gmail', checkAuthenticated, (req, res) => {
    gmailIntegrator.authorize(req.user.id, res)
})

router.get('/service/gmail/authorize', checkAuthenticated, async (req, res) => {
    await gmailIntegrator.getTokens(req.query.code, req.user.id, res)
})

//Main routes

router.get("/services", checkAuthenticated, async (req, res) => {
    res.render("./integrations/services.ejs", {
        user: req.user.id,
        services: await getServices()
    })
})

router.get('/:projectID', checkAuthenticated, async (req, res) => {
    res.render('./integrations/index.ejs', {
        user: req.user,
        projectID: req.params.projectID,
        project: await getProject(req.params.projectID),
        projects: await getProjects(req.user.id),
        integrations: [{
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
    })
})

router.get('/:integrationId/:projectID', checkAuthenticated, async (req, res) => {
    //await executeAction(req.params.actionId, req.params.projectID)
    res.render('./integrations/integration.ejs', {
        user: req.user,
        projectID: req.params.projectID,
        action: await getIntegration(req.params.integrationId)
    })
})

//HELPER FUNCTIONS

function getServices(){
    return new Promise(async(resolve, reject) => {
        await dataCamp.collection("services").find().toArray((err, services) => {
            if(err) reject(err)
            resolve(services)
        })
    })
}

module.exports = router