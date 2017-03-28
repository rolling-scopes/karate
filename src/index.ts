
import * as pino from 'pino';
import * as codewars from './codewars/scrape';

const logger = pino();

export const scrape_katas = (evt, ctx, cb) => {
  logger.info('Start');

  const { username } = JSON.parse(evt.body);

  if (!username) return cb(null, {
    statusCode: 500,
    body: JSON.stringify({ error: new Error('username is empty') }),
  });

  logger.info(username);

  codewars.scrape_katas(username)
    .then(data => cb(null, { statusCode: 200, body: JSON.stringify({ data }) }))
    .catch((error) => {
      logger.error(error);
      cb(null, {
        statusCode: 500,
        body: JSON.stringify({ error })
      });
    });
};