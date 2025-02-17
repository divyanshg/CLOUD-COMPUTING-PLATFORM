var dCamp = require('./database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get())
    .catch(e => console.log(e))



module.exports = {
    addToQueue: (req, res) => {
        const document = req.body.document
        document.ownerID = req.user.id
        document.projectID = req.params.projectID
        document.status = "PENDING"
        document.createdOn = Date.now()
        dataCamp.collection("bulk-registration-queue").insertOne(document, (err, response) => {
            if (err) res.sendStatus(500)
            res.sendStatus(200)
            return
        })
    },
    getActivities: (req, res) => {
        return new Promise((resolve, reject) => {
            const ownerID = req.user.id
            dataCamp.collection('bulk-registration-queue').find({
                ownerID,
                projectID: req.params.projectID
            }).toArray((err, queue) => {
                if (err) reject()

                const finished = queue.filter(activity => activity.status === "FINISHED")
                const pending = queue.filter(activity => activity.status === "PENDING")

                resolve({
                    pending,
                    finished
                })
            })
        })
    }
}