
const users = [{
    "id": "1",
    "name": "Divyansh Gupta",
    "email": "divyanshg809@gmail.com",
    "pass": "$2b$10$lQBaEE68GM.03D0mXe6kEOo1M.XMXEnKyMDP9J6KcB4Q2lMIOsFoi"
}]

module.exports = {
    getByEmail: email => users.find(user => user.email === email),
    getById: id => users.find(user => user.id == id),
    users: users
}