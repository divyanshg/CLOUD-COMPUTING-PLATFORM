const express = require('express')
const app = express()
var http = require('http').createServer(app);

var current_queue = []
var pending_queue = []

module.exports ={ 
    addToQueue: (order) => {
        if(current_queue.length == 10){
            pending_queue.push(order)
        }
        current_queue.push(order)
    }
}

setTimeout(clearCurrentQueue, 2000)

function clearCurrentQueue(){
    console.log(current_queue)

    current_queue.forEach(order => {
        console.log(order)
    })

    current_queue = []

    pending_queue.forEach(order => {
        current_queue.push(order)
        pending_queue.shift()
    })
}

http.listen(3030, () => {
    console.log('listening on *:3000');
});