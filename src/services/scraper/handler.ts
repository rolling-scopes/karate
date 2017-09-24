import * as chrome from '@serverless-chrome/lambda'
import * as scraper from './lib/scraper'
import * as task from './models/task'
import expressions from './expressions'
import { createResponse } from '../../shared/utils'

const CHROME_OPTIONS = {
  flags: ['--window-size=1280x1696', '--ignore-certificate-errors'],
}

const getQueryFromStream = record => {
  const { expression, url } = record.dynamodb.NewImage
  console.log(expression, url)
  return { url: url.S, expression: expression.S }
}

export const scrape = async (evt, ctx, cb) => {
  try {
    await chrome(CHROME_OPTIONS)

    const query = getQueryFromStream(evt.Records[0])

    if (!query.url || !query.expression) throw new Error('Empty query')

    const { result } = await scraper.scrape(query)
    const { value } = result

    if (!value) throw new Error('Empty result')

    await task.update({ query, value })

    cb(null)
  } catch (e) {
    console.log(e)
    cb(null)
  }
}

export const getResult = async (evt, ctx, cb) => {
  try {
    const id = evt.pathParameters.id
    const { Item } = await task.get(id)
    const response = Item.res ? createResponse(200, Item) : createResponse(202)

    cb(null, response)
  } catch (e) {
    console.log(e)
    cb(null, createResponse(500, { err: e.message }))
  }
}

export const addTask = async (evt, ctx, cb) => {
  try {
    const { url, expression } = JSON.parse(evt.body)

    if (!url || !expression) throw new Error('Missed url or expression')

    const id = await task.add(url, expression)

    cb(null, createResponse(202, { id }))
  } catch (e) {
    console.log(e)
    cb(null, createResponse(500, { err: e.message }))
  }
}

export const findExpression = async (evt, ctx, cb) => {
  try {
    const { pageName, meta } = JSON.parse(evt.body)

    if (!pageName || !meta) throw new Error('Missed name or meta')

    const expression = expressions(pageName, meta)

    cb(null, createResponse(200, expression))
  } catch (e) {
    console.log(e)
    cb(null, createResponse(500, { err: e.message }))
  }
}
