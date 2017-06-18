import * as P from 'bluebird'

export const createResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(body)
})

export const parsePayload = req =>
  P.attempt(() => {
    const { username } = JSON.parse(req.body)
    if (!username) {
      throw new Error('username is empty')
    }

    return username
  })

export const parsePageId = req =>
  P.attempt(() => {
    const pageId = req.pathParameters.page_id
    if (!pageId) {
      throw new Error('pageId is empty')
    }

    return pageId
  })

export const sqsUrl = (region, accountId, name) =>
  `https://sqs.${region}.amazonaws.com/${accountId}/${name}`
