import { mapSeries } from 'bluebird'
import { createExpression } from './lib/expressions'
import logger from './lib/logger'
import * as scraper from './lib/scraper'
import * as task from './lib/task'
import { createResponse } from './lib/utils'

const getQueriesFromStream = (evt: any) => {
  const records = evt.Records.filter((r: any) => r.eventName === 'INSERT')

  if (!records.length) return null;

  const images = records.map((r: any) => r.dynamodb.NewImage)

  const queries = images
    .map(img => ({
      url: img.url.S,
      expression: img.expression.S,
      timestamp: img.timestamp.N
    }))
    .filter(d => d.url !== 'empty'); // TODO: Validate properly

  return queries
}

export const scrape = async (evt, ctx, cb) => {
  try {
    logger.info('DynamoDB Stream Object: ', JSON.stringify(evt))

    const queries = getQueriesFromStream(evt)

    logger.info('Query: ', { queries })

    if (!queries) {
      throw new Error('Empty query list')
    }

    const data = await mapSeries(queries, q => scraper.scrape(q).catch(logger.error))

    logger.info('Data: ', { data })

    await Promise.all(data.map(d => task.update({
      query: { url: d.url, expression: d.expression },
      timestamp: d.timestamp,
      value: d.value
    })))
    cb(null)
  } catch (e) {
    logger.error(e)
    cb(null)
  }
}

export const getResult = async (evt, ctx, cb) => {
  try {
    const { id } = evt.pathParameters

    if (!id) throw new Error('ID is required')

    const { Items } = await task.getLatest(id)

    logger.info('Task items: ', Items)

    const response = Items && Items[0] && Items[0].result
      ? createResponse(200, { data: JSON.parse(Items[0].result) })
      : createResponse(202)

    cb(null, response)
  } catch (e) {
    logger.error(e)
    cb(createResponse(400, { err: e.message }))
  }
}

export const addTask = async (evt, ctx, cb) => {
  try {
    const { url, expression } = JSON.parse(evt.body)

    logger.info('Task params: ', { url, expression })

    if (!url || !expression) throw new Error('Missed url or expression')

    const { task_id } = await task.add(url, expression)

    logger.info('Task id: ', { task_id })

    cb(null, createResponse(202, { id: task_id }))
  } catch (e) {
    logger.error(e)
    cb(createResponse(400, { err: e.message }))
  }
}

export const findExpression = async (evt, ctx, cb) => {
  try {
    const { pageName, meta } = JSON.parse(evt.body)

    logger.info('Query: ', { pageName, meta })

    if (!pageName || !meta) throw new Error('Missed name or meta')

    const expression = createExpression(pageName, meta)

    logger.info('Expression: ', expression)

    cb(null, createResponse(200, expression))
  } catch (e) {
    logger.error(e)
    cb(createResponse(400, { err: e.message }))
  }
}
