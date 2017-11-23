import logger from "../lib/logger";

const google = require('googleapis')
import { getJwtClient } from './gapiClient'

const RANGES = {
  CODEWARS: 'Sheet1!D2:D',
}

const CODEWARS_URL_START = 'https://www.codewars.com/users/';
const CODEWARS_USERNAME_POSITION = 4;

let sheets = null

export function getCodewarsNicknames () {
  return new Promise((resolve, reject) => {
    const jwtClient = getJwtClient()
    jwtClient.authorize(async (err, tokens) => {
      if (err) reject(err)
      sheets = google.sheets({
        version: 'v4',
        auth: jwtClient
      })
      try {
        const data: any = await getCodewarsNicknamesFromSheet()
        resolve(data.map(v => checkURL(v)));
      } catch (err) {
        logger.error(err)
        reject(err)
      }
    })
  })
}

function checkURL(maybeUrl: string) {
  if(maybeUrl && maybeUrl.indexOf(CODEWARS_URL_START) > -1) {
    return maybeUrl.split('/')[CODEWARS_USERNAME_POSITION];
  } else {
    return maybeUrl;
  }
}

function getCodewarsNicknamesFromSheet () {
  return new Promise((resolve, reject) => {
    sheets && sheets.spreadsheets.values.get({
      spreadsheetId: process.env.CODEWARS_ACCOUNTS_SHEET,
      range: RANGES.CODEWARS
    }, (err, response) => {
      if (err) {
        logger.error(err)
        reject(err)
      }
      if (response && response.values) {
        resolve(response.values.map(s => s[0]).filter(s => !!s))
      } else {
        reject('no users found')
      }
    })
  })
}