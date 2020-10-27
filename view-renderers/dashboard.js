const {
    get
} = require('../models/database')
const {
    uuid
} = require('uuidv4');

const {
    getActivities
} = require("../models/bulk-register");
const { getProject, getProjects } = require('../models/projects');

module.exports = {
    renderDashboard: async (req, res) => {
        var dashboardId = req.sessionID
        var user = req.user;
        delete user.pass;
        res.render('dashboard.ejs', {
            dashboardId,
            user,
            owner: '898435880938453458935',
            projectID:req.params.projectID, 
            project: await getProject(req.params.projectID),
            projects: await getProjects(req.user.id)
        })
    },
    renderActivity: async (req, res) => {
        let activities = await getActivities(req, res)
        activities.projectID = req.params.projectID
        activities.project = await getProject(req.params.projectID)
        activities.projects = await getProjects(req.user.id)
        res.render('activity.ejs', activities)
    }
}
