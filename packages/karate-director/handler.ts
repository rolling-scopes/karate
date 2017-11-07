import { createResponse } from './lib/utils'

export const result = async (evt, ctx, cb) => {
  console.log(evt)
  cb(null, createResponse(200, {}))
}
