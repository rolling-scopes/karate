const google = require('googleapis')
import { getJwtClient } from './gapiClient'


const RANGES = {
    CODEWARS: 'Sheet1!D2:D',
}

let sheets = null




export function getCodewarsNicknames() {
    return new Promise((resolve, reject) => {
        const jwtClient = getJwtClient()
        jwtClient.authorize((err,tokens) => {
            if(err) reject(err)
            sheets = google.sheets({
                    version: 'v4',
                    auth: jwtClient
                })
            getCodewarsNicknamesFromSheet()
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    })
}
   
function getCodewarsNicknamesFromSheet() {
    return new Promise((resolve, reject) => {
        sheets && sheets.spreadsheets.values.get({
                spreadsheetId: process.env.CODEWARS_ACCOUNTS_SHEET,
                range: RANGES.CODEWARS
            }, (err, response) => {
                if (err) reject(err)
                resolve(response.values.map(s => s[0]).filter(s => !!s))
        })
    })
}