const {
    encrypt,
    decrypt
} = require('./security')

var dataCamp = require('./database')

const {
    uuid
} = require('uuidv4');


dataCamp.connect()
    .then(() => dataCamp = dataCamp.get())
    .catch(e => console.log(e))


function getLoginDetails(uuid, request) {
    var ua = request.headers['user-agent'],
        $ = {};

    if (/mobile/i.test(ua))
        $.device = true;

    if (/like Mac OS X/.test(ua)) {
        $.OS = "IOS " + /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        $.device = "iPhone " + /iPhone/.test(ua);
        $.device = "iPad " + /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        $.OS = "Android " + /Android ([0-9\.]+)[\);]/.exec(ua)[1];

    if (/webOS\//.test(ua))
        $.OS = "WebOS " + /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        $.OS = "Mac OS " + /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
    $.device = "Desktop"

    if (/Windows NT/.test(ua))
        $.OS = "Windows " + /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
    $.device = "Desktop"

    if (/firefox/i.test(ua))
        $.browser = 'Firefox';
    else if (/chrome/i.test(ua))
        $.browser = 'Chrome';
    else if (/safari/i.test(ua))
        $.browser = 'Safari';
    else if (/msie/i.test(ua))
        $.browser = 'Msie';
    else
        $.browser = 'unknown';
    
    $.session = request.sessionID    
    $.ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
    $.timeStamp = Date.now()

    return $
}


module.exports = {
    saveLogin: (userInfo) => {
        dataCamp.collection('loginActivity').insertOne(getLoginDetails(userInfo.user, userInfo.req), (err, response) => {
            if(err) return
            return
        })
    },
    saveAccessToken: (uuid, accessToken) => {
        dataCamp.collection('users').updateOne({uuid}, { $set: { accessToken } }, (err, response) => {
            if(err) return
            return 
        })
    }
}