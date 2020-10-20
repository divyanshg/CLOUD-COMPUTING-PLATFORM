const {
    get
} = require('../models/database')
const {
    uuid
} = require('uuidv4');

const {
    getActivities
} = require("../models/bulk-register")

module.exports = {
    renderDashboard: async (req, res) => {
        var dashboardId = req.sessionID

        res.render('dashboard.ejs', {
            dashboardId,
            owner: '898435880938453458935',
            project: {
                "id": 293522617,
                "parentId": -1,
                "isPreview": false,
                "name": "Demo project",
                "createdAt": 1600340729916,
                "updatedAt": 1600341144553,
                "rows": [{"id":"someid","name":"First Row"}, {"id":"anotherid","name":"Second Row"}],
                "widgets": [{
                    "type": "BUTTON",
                    "inRow": "someid",
                    "id": 34061,
                    "pos": 2,
                    "color": "white",
                    "BackGround": "#2f3136",
                    "width": "1/3",
                    "label": "On Off",
                    "isDefaultColor": true,
                    "deviceId": 'uiue-6uihu-niu56-nio546-noi645-435iu',
                    "feed": 'somerandomfeed',
                    "pin": -1,
                    "pwmMode": false,
                    "rangeMappingOn": false,
                    "min": 0.0,
                    "max": 1.0,
                    "value": "0.0",
                    "pushMode": true,
                    "fontSize": "MEDIUM",
                    "currentState":"OFF"
                }],
                "devices": [{
                    "id": 0,
                    "name": "Demo project",
                    "boardType": "ESP32 Dev Board",
                    "vendor": "New Device",
                    "connectionType": "WI_FI",
                    "isUserIcon": false
                }],
                "theme": "Blynk",
                "keepScreenOn": false,
                "isAppConnectedOn": false,
                "isNotificationsOff": false,
                "isShared": false,
                "isActive": false,
                "widgetBackgroundOn": false,
                "color": 0,
                "isDefaultColor": true
            }
        })
    },
    renderActivity: async (req, res) => {
        let activities = await getActivities(req, res)
        res.render('activity.ejs', activities)
    }
}