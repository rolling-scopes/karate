
import * as pino from 'pino';
import * as codewars from './codewars/scrape';

const logger = pino();

export const scrape_katas = (evt, ctx, cb) => {
  logger.info('Start');

  const { username } = JSON.parse(evt.body);

  if (!username) return cb(new Error('username is empty'));

  logger.info(username);

  codewars.scrape_katas(username)
    .then(data => cb(null, { data }))
    .catch((error) => {
      logger.error(error);
      cb(error);
    });
};