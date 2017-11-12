import 'request'
import rq from 'request-promise-native'

const SCRAPER_ENDPOINT = process.env.SCRAPER_ENDPOINT;

export const findExpression = (pageName, userName) =>
  rq({
    method: 'POST',
    uri: `${SCRAPER_ENDPOINT}/expression`,
    body: {
      "pageName": pageName,
      "meta": { "userName": userName }
    },
    json: true
  });

export const addScrapeTask = ({ url, expression }) =>
  rq({
    method: 'POST',
    uri: `${SCRAPER_ENDPOINT}/tasks`,
    body: { url, expression },
    json: true
  });

export const getResults = async ({ id }) => {
  const { statusCode, body } = await rq({
    method: 'GET',
    uri: `${SCRAPER_ENDPOINT}/results/${id}`,
    resolveWithFullResponse: true,
    json: true
  });

  return {
    statusCode,
    data: body
  }
}
