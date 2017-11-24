import { getJwtClient, initSheetsClient } from './gapiClient'
import { RANGES } from './config'
import { checkURL } from "./helpers";

let sheets: any = null


export function writeToSheet (userName: string, score: number) {
  return new Promise((resolve, reject) => {
    const jwtClient = getJwtClient()
    jwtClient.authorize((err, tokens) => {
      if (err) reject(err)
      sheets = initSheetsClient(jwtClient);
      findTargetUser(userName)
        .then(user => findUserScoreRow(user))
        .then(targetRowIndex => updateUserScore(targetRowIndex, score))
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  })
}

function findTargetUser (userName: string) {
  return new Promise((resolve, reject) => {
    sheets && sheets.spreadsheets.values.get({
      spreadsheetId: process.env.CODEWARS_ACCOUNTS_SHEET,
      range: RANGES.CODEWARS_TO_USERNAME
    }, (err, response) => {
      if (err) reject(err)
      const values = response && response.values

      let targetRowIndex = values && values.findIndex((v: string) => v[3] === userName || checkURL(v[3]) === userName)
      if (targetRowIndex > -1) {
        resolve(values[targetRowIndex][0])
      }
      reject('Unable to get target user')
    });
  });
}

function findUserScoreRow (user: string) {
  return new Promise((resolve, reject) => {
    sheets && sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SCORE_SHEET,
      range: RANGES.SCORES_USERNAMES
    }, (err, response) => {
      if (err) reject(err)
      const values = response && response.values
      let targetRowIndex = values && values.findIndex((v: string) => v[0] === user)
      if (targetRowIndex) {
        resolve(++targetRowIndex)
      }
      reject('Unable to get target row index')
    })
  })
}


function updateUserScore (targetRowIndex, score) {
  return new Promise((resolve, reject) => {
    sheets && sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SCORE_SHEET,
      range: `${RANGES.CODEWARS_SCORES}${targetRowIndex}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[score]]
      }
    }, (err, response) => {
      if (err) {
        reject('Failed to update user score' + err)
      } else {
        resolve('Successfully updated score')
      }
    })
  })
}