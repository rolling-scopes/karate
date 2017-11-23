import { classify } from './services/classifier'
import { writeToSheet } from './services/sheetWriter'
import { getCodewarsNicknames } from './services/sheetAccessor'
import 'request'
import rq from 'request-promise-native'
import logger from './lib/logger'

export const createResponse = (statusCode, body?) => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: body ? JSON.stringify(body) : null,
})

export const evaluate = async (evt, ctx, cb) => {
  const { userName, data, pageName } = JSON.parse(evt.body || evt.Records[0].Sns.Message)
  logger.info('userdata', JSON.stringify({ userName, data, pageName }))
  const response: any = {
    body: {
      userName,
      message: ''
    }
  }
  writeToSheet(userName, classify(data.data))
    .then(data => {
      response.body.message = data
      cb(null, createResponse(200, response.body))
    }).catch(err => {
      response.body.message = err
      cb(null, createResponse(400, response.body))
    })
}

export const startCodewarsEvaluation = async (evt, ctx, cb) => {
  const response: any = {
    body: {
      message: ''
    }
  }
  getCodewarsNicknames()
    .then(data => {
      logger.info(data)
      return rq({
        method: 'POST',
        uri: `https://i3m0xs5h0e.execute-api.eu-west-1.amazonaws.com/test/scrape/katas`,
        body: {
          "users": data
        },
        json: true
      })
    }).then(data => {
      response.body.message = 'success'
      cb(null, createResponse(200, response.body))
  }).catch(err => {
      logger.error(err);
      response.body.message = err.message || err
      cb(null, createResponse(400, response.body))
    })
}