import { SNS } from 'aws-sdk'
import * as chrome from '@serverless-chrome/lambda'
import * as scraper from './lib/scraper'
import { createResponse } from '../../shared/utils'

const CHROME_OPTIONS = {
  flags: ['--window-size=1280x1696', '--ignore-certificate-errors'],
}

const sns = new SNS({ apiVersion: '2010-03-31' })

const getQueryFromStream = record => {
  const { expression, url } = record.dynamodb.NewImage
  return { url: url.S, expression: expression.S }
}

export const scrape = async (evt, ctx, cb) => {
  try {
    await chrome(CHROME_OPTIONS)

    const query = evt.Records
      ? getQueryFromStream(evt.Records[0])
      : JSON.parse(evt.body)

    const { result } = await scraper.scrape(query)
    const { value } = result

    if (!value) throw new Error('Empty result')

    const parsed = JSON.parse(value)
    const res = { query, parsed }
    const params = {
      TopicArn: process.env.result_arn,
      Message: JSON.stringify(res),
    }

    await sns.publish(params).promise()

    cb(null, createResponse(200, res))
  } catch (e) {
    console.log(e)
    cb(null, createResponse(500, { error: e.message }))
  }
}
