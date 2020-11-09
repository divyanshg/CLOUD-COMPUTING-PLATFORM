const StreamTransport = require("nodemailer/lib/stream-transport");
var twit = require("twit");

var config = require('./config/twitter')

var T = new twit(config)

var stream = T.stream('statuses/filter', { track: "#IndiaFightsCoronaVirus" });

stream.on("tweet", (tweet) => {
    console.log(tweet)
})