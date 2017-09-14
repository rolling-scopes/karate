import * as result from './models/result'
import * as task from './models/task'
import expressions from './expressions'
import { createResponse } from '../shared/utils'

export const getResult = async (evt, ctx, cb) => {
  try {
    const taskId = evt.queryStringParameters.task_id
    const data = await result.get(taskId)

    cb(null, createResponse(200, data))
  } catch (e) {
    cb(null, createResponse(200, { err: e.message }))
  }
}

export const addTask = async (evt, ctx, cb) => {
  try {
    const { url, expression } = JSON.parse(evt.body)

    if (!url || !expression) throw new Error('Missed url or expression')

    const data = await task.add(url, expression)

    cb(null, createResponse(200, data))
  } catch (e) {
    cb(null, createResponse(200, { err: e.message }))
  }
}

export const findExpression = async (evt, ctx, cb) => {
  try {
    const { pageName, meta } = JSON.parse(evt.body)

    if (!pageName || !meta) throw new Error('Missed name or meta')

    const expression = expressions(pageName, meta)

    cb(null, createResponse(200, expression))
  } catch (e) {
    cb(null, createResponse(200, { err: e.message }))
  }
}
