import { Handler } from 'aws-lambda'
import { createExpression } from './expressions'
import logger from './lib/logger'
import * as scraper from './lib/scraper'
import * as task from './lib/task'
import { createResponse } from './lib/utils'

const getQueriesFromStream = evt => {
  const records = evt.Records.filter(r => r.eventName === 'INSERT')

  if (!records.length) return null;

  const images = records.map(record => record.dynamodb.NewImage)

  const queries = images.map(img => ({
    url: img.url.S,
    expression: img.expression.S,
    timestamp: img.timestamp.N
  }));

  return queries
}

export const scrape: Handler = async (evt, ctx, cb) => {
  try {
    logger.info('DynamoDB Stream Object: ', JSON.stringify(evt))

    const queries = getQueriesFromStream(evt)

    logger.info('Query: ', { queries })

    if (!queries) {
      throw new Error('Empty query list')
    }

    const data = await Promise.all(queries.map(q => scraper.scrape(q)))

    logger.info('Data: ', { data })

    await Promise.all(data.map(d => task.update({
      query: { url: d.url, expression: d.expression },
      timestamp: d.timestamp,
      value: d.value
    })))
    cb(null)
  } catch (e) {
    logger.error(e)
    cb(null) // disable retry policy
  }
}

export const getResult: Handler = async (evt, ctx, cb) => {
  try {
    const id = evt.pathParameters!.id!

    if (!id) throw new Error('ID is required')

    const { Items } = await task.getLatest(id)

    logger.info('Task item: ', Items)

    const response = Items[0].result
      ? createResponse(200, { data: JSON.parse(Items[0].result) })
      : createResponse(202)

    cb(null, response)
  } catch (e) {
    logger.error(e)
    cb(null, createResponse(400, { err: e.message }))
  }
}

export const addTask: Handler = async (evt, ctx, cb) => {
  try {
    const { url, expression } = JSON.parse(evt.body)

    logger.info('Task params: ', { url, expression })

    if (!url || !expression) throw new Error('Missed url or expression')

    const { task_id } = await task.add(url, expression)

    logger.info('Task id: ', { task_id })

    cb(null, createResponse(202, { id: task_id }))
  } catch (e) {
    logger.error(e)
    cb(null, createResponse(400, { err: e.message }))
  }
}

export const findExpression: Handler = async (evt, ctx, cb) => {
  try {
    const { pageName, meta } = JSON.parse(evt.body)

    logger.info('Query: ', { pageName, meta })

    if (!pageName || !meta) throw new Error('Missed name or meta')

    const expression = createExpression(pageName, meta)

    logger.info('Expression: ', expression)

    cb(null, createResponse(200, expression))
  } catch (e) {
    logger.error(e)
    cb(null, createResponse(400, { err: e.message }))
  }
}
