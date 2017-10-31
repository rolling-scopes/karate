import * as scraper from './lib/scraper'
import * as task from './lib/task'
import { createExpression } from './expressions'
import { createResponse } from './lib/utils'
import logger from './lib/logger'

const getQueryFromStream = evt => {
  const image = evt.Records[0].dynamodb.NewImage
  return image ? { url: image.url.S, expression: image.expression.S } : null
}

export const scrape = async (evt, ctx, cb) => {
  try {
    logger.info('DynamoDB Stream Object: ', evt.Records[0].dynamodb)

    const query = getQueryFromStream(evt)

    logger.info('Query: ', { query })

    if (!query || !query.url || !query.expression) throw new Error('Empty query')

    const { result } = await scraper.scrape(query)

    logger.info('Result: ', { result })

    const { value } = result

    await task.update({ query, value: value || 'empty value' })

    cb(null)
  } catch (e) {
    logger.error(e)
    cb(null)
  }
}

export const getResult = async (evt, ctx, cb) => {
  try {
    const id = evt.pathParameters.id

    const { Item } = await task.get(id)

    logger.info('Task item: ', Item)

    const response = Item.res
      ? createResponse(200, { data: JSON.parse(Item.res) })
      : createResponse(202)

    cb(null, response)
  } catch (e) {
    logger.error(e)
    cb(null, createResponse(500, { err: e.message }))
  }
}

export const addTask = async (evt, ctx, cb) => {
  try {
    const { url, expression } = JSON.parse(evt.body)

    logger.info('Task params: ', { url, expression })

    if (!url || !expression) throw new Error('Missed url or expression')

    const id = await task.add(url, expression)

    logger.info('Task id: ', { id })

    cb(null, createResponse(202, { id }))
  } catch (e) {
    logger.error(e)
    cb(null, createResponse(500, { err: e.message }))
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
    cb(null, createResponse(500, { err: e.message }))
  }
}
