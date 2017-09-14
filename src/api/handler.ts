import * as result from './models/result'
import * as task from './models/task'
import { createResponse } from '../shared/utils'

export const getResult = async (evt, ctx, cb) => {
  const resultId = evt.queryStringParameters.result_id
  const data = await result.get(resultId)

  cb(null, createResponse(200, data))
}

export const addTask = async (evt, ctx, cb) => {
  const { pageId, expression } = JSON.parse(evt.body)

  const data = await task.add(pageId, expression)

  cb(null, createResponse(200, data))
}
