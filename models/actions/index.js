const fetch = require('node-fetch');

module.exports = {
    allActions: () => {

    },
    getAction: () => {
        return {
            id: "n5ion5o",
            title: "Mail me when water tank is full",
            status: "CONNECTED",
            endPoint: "assistant",
        }
    },
    addAction: () => {

    },
    checkAction: () => {

    },
    executeAction: (id, projectID) => {
        fetch(`http://localhost:6001/execute/${id}/${projectID}`)
        .then(res => res.status)
        .then(status => console.log(status))
    }
}