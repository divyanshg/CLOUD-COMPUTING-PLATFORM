const fetch = require('node-fetch');

module.exports = {
    allIntegrations: () => {

    },
    getIntegration: (id) => {
        return {
            id: "n5ion5o",
            title: "Mail me when water tank is full",
            status: "CONNECTED",
            endPoint: "assistant",
        }
    },
    addIntegration: () => {

    },
    checkIntegration: () => {

    },
    executeIntegration: (id, projectID) => {
        fetch(`http://localhost:6001/execute/${id}/${projectID}`)
        .then(res => res.status)
        .then(status => console.log(status))
    }
}