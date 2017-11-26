import 'request'
import rq from 'request-promise-native'

const SCRAPER_ENDPOINT = process.env.SCRAPER_ENDPOINT
const CODEWARS_ENDPOINT = process.env.CODEWARS_ENDPOINT

export const getResolvedKatas = ({ userName, page = 0}) =>
  rq({
    method: 'GET',
    uri: `${CODEWARS_ENDPOINT}/users/${userName}/code-challenges/completed`,
    headers: { Authorization: process.env.CODEWARS_API_KEY },
    qs: { page },
    json: true,
  })

export const getKatasInfo = ({ id }) =>
  rq({
    method: 'GET',
    uri: `${CODEWARS_ENDPOINT}/code-challenges/${id}`,
    headers: { Authorization: process.env.CODEWARS_API_KEY },
    json: true,
  })

export const findExpression = ({ pageName, userName }) =>
  rq({
    method: 'POST',
    uri: `${SCRAPER_ENDPOINT}/expression`,
    body: {
      pageName: pageName,
      meta: { userName: userName },
    },
    json: true,
  })

export const checkAddress = ({ url }) =>
  rq({
    uri: url,
  })

export const addScrapeTask = ({ url, expression }) =>
  rq({
    method: 'POST',
    uri: `${SCRAPER_ENDPOINT}/tasks`,
    body: { url, expression },
    json: true,
  })

export const getResults = async ({ id }) => {
  const { statusCode, body } = await rq({
    method: 'GET',
    uri: `${SCRAPER_ENDPOINT}/results/${id}`,
    resolveWithFullResponse: true,
    json: true,
  })

  return {
    statusCode,
    id,
    ...body,
  }
}
