const google = require('googleapis');
const key = require('../client_secret.json')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const RANGES = {
    CODEWARS_TO_USERNAME: 'Sheet1!A1:D',
    SCORES_USERNAMES: 'Sheet1!B1:B',
    CODEWARS_SCORES: 'Sheet1!X'
}

let sheets = null;


const authorize = (key) => {
    return new google.auth.JWT(
      key.client_email,
      '../key.pem',
      key.private_key,
      SCOPES,
      null
    );
}

export function writeToSheet(userName, score) {
    return new Promise((resolve, reject) => {
        const jwtClient = authorize(key);
        jwtClient.authorize((err,tokens) => {
            if(err) reject(err);
            sheets = google.sheets({
                    version: 'v4',
                    auth: jwtClient
                });
            findTargetUser(userName)
                .then(data => findUserScoreRow(data))
                .then(data => updateUserScore(data, score))
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    });
};
   
function findTargetUser(userName) {
    return new Promise((resolve, reject) => {
            sheets && sheets.spreadsheets.values.get({
                spreadsheetId: process.env.CODEWARS_ACCOUNTS_SHEET,
                range: RANGES.CODEWARS_TO_USERNAME
            }, (err, response) => {
                if (err) reject(err);
                const values = response.values;
                
                let targetRowIndex = values && values.findIndex(v => v[3] === userName);
                if (targetRowIndex > -1) {
                    resolve(values[targetRowIndex][0]);
                }
                reject('Unable to get target user');
        });
    });
}

function findUserScoreRow(user) {
    return new Promise((resolve, reject) => {
            sheets && sheets.spreadsheets.values.get({
                spreadsheetId: process.env.SCORE_SHEET,
                range: RANGES.SCORES_USERNAMES
            }, (err, response) => {
                if (err) reject(err);
                const values = response.values;
                let targetRowIndex = values && values.findIndex(v => v[0] === user);
                if (targetRowIndex) {
                    resolve(++targetRowIndex);
                }
                reject('Unable to get target row index');
        });
    });
}


function updateUserScore(targetRowIndex, score) {
  return new Promise((resolve,reject) => {
    sheets && sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SCORE_SHEET,
        range: `${RANGES.CODEWARS_SCORES}${targetRowIndex}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [ [score] ]
        }
      }, (err, response) => {
        if (err) {
            reject('Failed to update user score' + err)
        } else {
            resolve('Successfully updated score')
        }
      }); 
  })
}