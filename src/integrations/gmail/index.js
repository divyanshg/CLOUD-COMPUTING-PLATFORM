const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

const {
    response
} = require('express');


var dCamp = require('../../../models/database')
var dataCamp;

dCamp.connect()
    .then(async () => dataCamp = await dCamp.get().collection("integrations"))
    .catch(e => console.log(e))

const SERVICE = "GMAIL"

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './src/integrations/gmail/token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(userID, res) {

    // Load client secrets from a local file.
    fs.readFile('./src/integrations/gmail/credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        const credentials = JSON.parse(content)

        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        dataCamp.findOne({ name:SERVICE, userID }, { projection:{ _id:0, token:1 } }, (err, token) => {
            if (err) return res.redirect(getNewToken(oAuth2Client));

            if(token == null) return res.redirect(getNewToken(oAuth2Client));
            
            oAuth2Client.setCredentials(token);
            res.send("ALREADY AUTHORIZED")
        });
    });

}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    return authUrl;

}

function getTokens(code, userID, res) {
    fs.readFile('./src/integrations/gmail/credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        const credentials = JSON.parse(content)

        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);


        oAuth2Client.getToken(code, async (err, token) => {
            if (err) return res.sendStatus(500);
            oAuth2Client.setCredentials(token);

            // Store the token to disk for later program executions

            await dataCamp.insertOne({
                name: SERVICE,
                userID,
                token
            }, (err, response) => {
                if (err) res.sendStatus(500)
                listMessages(oAuth2Client)
                res.sendStatus(200)
            })
            //callback(oAuth2Client);
        });
    })
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMessages(auth) {
    const gmail = google.gmail({
        version: 'v1',
        auth
    });
    gmail.users.messages.list({
        auth,
        userId: "divyanshg809@gmail.com",
    }, (err, res) => {
        const recentID = res["data"]["messages"][0]["id"]
        gmail.users.messages.get({
            auth,
            userId: "me",
            id: recentID
        }, (err, response) => {
            console.log(response.data.payload.body)
        })
    })
}

module.exports = {
    authorize,
    getTokens
}