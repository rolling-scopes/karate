import { classify } from './services/classifier'
import { writeToSheet } from './services/sheetWriter'
import { getCodewarsNicknames } from './services/sheetAccessor'
import 'request'
import rq from 'request-promise-native'
import logger from './lib/logger'
import { isArray } from "util";

export const createResponse = (statusCode, body?) => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: body ? JSON.stringify(body) : null,
})

export const evaluate = async (evt: any, ctx: any, cb: any) => {
  const { userName, data, pageName } = JSON.parse(evt.body || evt.Records[0].Sns.Message)
  logger.info('userdata', JSON.stringify({ userName, data, pageName }))
  writeToSheet(userName, classify(data.data))
    .then(data => {
      cb(null, createResponse(200, { message: data }))
    }).catch(err => {
      cb(null, createResponse(400,  { message: err }))
    })
}

export const startCodewarsEvaluation = async (evt: any, ctx: any, cb: any) => {
  getCodewarsNicknames()
    .then((data: Array<string>) => {
      logger.info('nicknames', data)
      return rq({
        method: 'POST',
        uri: process.env.SENSEI_URL,
        body: {
          users: data
        },
        json: true
      })
    }).then(() => {
      cb(null, createResponse(200, { messsage: 'success' }))
    }).catch(err => {
      logger.error(err);
      err = err.message || err
      cb(null, createResponse(400, { message: err}))
    })
}
