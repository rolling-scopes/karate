
import * as P from 'bluebird';
import * as codewars from './handlers/codewars/scrape';
import * as duolingo from './handlers/duolingo/scrape';
import logger from './logger';

const parseUserName = req =>
  P.attempt(() => {
    const { username } = JSON.parse(req.body);

    if (!username) {
      throw new Error('username is empty');
    }

    return username;
  });

const headers = {
  'Access-Control-Allow-Origin': '*',
};

export const scrape_katas = (evt, ctx, cb) =>
  parseUserName(evt)
    .then(username => codewars.katas(username))
    .tap(data => logger.info('User', data))
    .then(data => cb(null, {
      headers,
      body: JSON.stringify({ data }),
    }))
    .catch((error) => {
      logger.error(error);
      cb(null, {
        headers,
        body: JSON.stringify({ error }),
      });
    });

export const scrape_duolingo = (evt, ctx, cb) =>
  parseUserName(evt)
    .then(username => duolingo.profile(username))
    .tap(data => logger.info('User', data))
    .then(data => cb(null, {
      headers,
      body: JSON.stringify({ data }),
    }))
    .catch((error) => {
      logger.error(error);
      cb(null, {
        headers,
        body: JSON.stringify({ error }),
      });
    });
