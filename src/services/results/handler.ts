import * as result from './models/result'
import * as task from './models/task'
import expressions from './expressions'
import { createResponse } from '../../shared/utils'

export const getResult = async (evt, ctx, cb) => {
  try {
    const id = evt.pathParameters.id
    const { Item } = await result.get(id)

    cb(null, createResponse(200, Item))
  } catch (e) {
    console.log(e)
    cb(null, createResponse(500, { err: e.message }))
  }
}

export const updateResult = async (evt, ctx, cb) => {
  try {
    const msg = evt.Records[0].Sns.Message
    const data = JSON.parse(msg)

    const status = await result.update(data)
    console.log(status)
    cb(null)
  } catch (e) {
    console.log(e)
    cb(e)
  }
}

export const addTask = async (evt, ctx, cb) => {
  try {
    const { url, expression } = JSON.parse(evt.body)

    if (!url || !expression) throw new Error('Missed url or expression')

    const { Item } = await task.add(url, expression)

    cb(null, createResponse(200, { id: Item.id }))
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
