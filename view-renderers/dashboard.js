const {
    get
} = require('../models/database')
const {
    uuid
} = require('uuidv4');

const {
    getActivities
} = require("../models/bulk-register");
const { getProject } = require('../models/projects');

module.exports = {
    renderDashboard: async (req, res) => {
        var dashboardId = req.sessionID
        res.render('dashboard.ejs', {
            dashboardId,
            owner: '898435880938453458935',
            projectID:req.query["project"], 
            project: await getProject(req.query["project"])
        })
    },
    renderActivity: async (req, res) => {
        let activities = await getActivities(req, res)
        res.render('activity.ejs', activities)
    }
}
