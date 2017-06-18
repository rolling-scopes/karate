import * as AWS from 'aws-sdk'
import * as P from 'bluebird'
import pages from '../../pages'
import logger from '../../logger'
import { createResponse, parsePayload, parsePageId, sqsUrl } from '../../utils'

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })

export const scrapeTask = async (evt, ctx, cb) => {
  try {
    const [ userName, pageId ] = await P.all([parsePayload(evt), parsePageId(evt)])

    logger.info({ userName, pageId })

    const { url, expression } = await pages(pageId, userName)

    await P.fromCallback(cb => sqs.sendMessage({
      QueueUrl: sqsUrl(process.env.region, +ctx.invokedFunctionArn.split(':')[4], process.env.sqs),
      MessageBody: JSON.stringify({ url, pageId, userName, expression, awaitPromise: true })
    }, cb))

    await P.fromCallback(cb => lambda.invoke({
      FunctionName: process.env.worker,
      InvocationType: 'Event'
    }, cb))

    cb(null, createResponse(200, { pageId, inQueue: true }))
  } catch (e) {
    cb(null, createResponse(500, { error: e.message }))
  }
}
