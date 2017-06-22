import * as AWS from 'aws-sdk'
import * as P from 'bluebird'
import { scrape } from '../../scraper'
import { sqsUrl } from '../../utils'
import logger from '../../logger'

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })

export const scrapeWorker = async (evt, ctx) => {
  try {
    const url = sqsUrl(process.env.region, +ctx.invokedFunctionArn.split(':')[4], process.env.sqs)
    const data = await P.fromCallback(cb => sqs.receiveMessage({
      QueueUrl: url,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10,
      MessageAttributeNames: ['All']
    }, cb))

    if (!data.Messages) return ctx.succeed()

    await P.map(data.Messages, async ({ Body, ReceiptHandle}) => {
      const query = JSON.parse(Body)

      const res = await scrape(query)

      logger.info(res)

      const data = JSON.parse(res.result.value) || {}

      await P.fromCallback(cb => lambda.invoke({
        FunctionName: process.env.sender,
        InvocationType: 'Event',
        Payload: JSON.stringify({ query, data })
      }, cb))

      await P.fromCallback(cb => sqs.deleteMessage({
        QueueUrl: url,
        ReceiptHandle
      }, cb))
    })

    return ctx.succeed()
  } catch (e) {
    console.log(e.message)
    return ctx.fail({ error: e.message })
  }
}
