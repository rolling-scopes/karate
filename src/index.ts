
import * as P from 'bluebird';
import * as CDP from 'chrome-remote-interface';
import * as codewars from './handlers/codewars/scrape';
import * as duolingo from './handlers/duolingo/scrape';
import * as test from './handlers/headless/headless';
import logger from './logger';

const parseUserName = req =>
  P.attempt(() => {
    if (req.method !== 'POST') {
      throw new Error('Only POST requests are accepted');
    }

    const { username } = req.body;

    if (!username) {
      throw new Error('username is empty');
    }

    return username;
  });

export const scrape_katas = (req, res) => {
  if (req.method === 'OPTIONS') {
    return res
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST')
      .status(200);
  }

  return parseUserName(req)
    .then(username => codewars.scrape_katas(username))
    .tap(data => logger.info('User', data))
    .then(data => res.json({ data }))
    .catch((error) => {
      logger.error(error);
      res.status(403)
        .json({ error: error.message || error });
    });
};

export const scrape_duolingo = (req, res) => {
  if (req.method === 'OPTIONS') {
    return res
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST')
      .status(200);
  }

  return parseUserName(req)
    .then(username => duolingo.scrape_profile(username))
    .tap(data => logger.info('User', data))
    .then(data => res.json({ data }))
    .catch((error) => {
      logger.error(error);
      res.status(403)
        .json({ error: error.message || error });
    });
};

export const test_headless = (req, res) => {
  test.test_cdp('https://medium.com', `document.querySelector('.u-letterSpacingTight').innerText`)
    .then(() => res.json({ data: CDP.version() }));
};
