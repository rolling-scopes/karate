import logger from "../lib/logger";

const google = require('googleapis')
import { getJwtClient, initSheetsClient } from './gapiClient'
import { checkURL} from "./helpers";
import { RANGES } from './config';

let sheets: any = null

export function getCodewarsNicknames () {
  return new Promise((resolve, reject) => {
    const jwtClient = getJwtClient()
    jwtClient.authorize(async (err: any, tokens) => {
      if (err) reject(err)
      sheets = initSheetsClient(jwtClient)
      try {
        const data: any = await getCodewarsNicknamesFromSheet()
        resolve(data.map((v: string) => checkURL(v)));
      } catch (err) {
        logger.error(err)
        reject(err)
      }
    })
  })
}

function getCodewarsNicknamesFromSheet () {
  return new Promise((resolve, reject) => {
    sheets && sheets.spreadsheets.values.get({
      spreadsheetId: process.env.CODEWARS_ACCOUNTS_SHEET,
      range: RANGES.CODEWARS
    }, (err: any, response: any) => {
      if (err) {
        logger.error(err)
        reject(err)
      }
      if (response && response.values) {
        resolve(response.values.map((s: string) => s[0]).filter((s: string) => !!s))
      } else {
        reject('no users found')
      }
    })
  })
}