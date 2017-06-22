import 'request'
import * as rq from 'request-promise'

export const scrapeSender = async ({ query, data }, ctx) => {
  const url = query.callback

  if (!url) return ctx.succeed()

  const params = {
    method: 'POST',
    uri: 'http://api.posttestserver.com/post',
    body: {
      query,
      data
    },
    json: true
  }

  await rq(params)

  return ctx.succeed()
}
