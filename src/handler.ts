
import * as P from 'bluebird';
import * as codewars from './codewars/scrape';
import * as duolingo from './duolingo/scrape';
import { createResponse } from './utils';
import logger from './logger';

const parseUserName = evt =>
  P.attempt(() => {
    const body = JSON.parse(evt.body);

    if (!body) {
      throw new Error('body is empty');
    }

    const { username } = body;

    if (!username) {
      throw new Error('username is empty');
    }

    return username;
  });

export const scrape_katas = (evt, ctx, cb) =>
  parseUserName(evt)
    .then(username => codewars.scrape_katas(username))
    .tap(data => logger.info('User', data))
    .then(data => cb(null, createResponse({ body: { data, error: null } })))
    .catch((error) => {
      logger.error(error);
      return cb(null, createResponse({
        body: { data: null, error: error.message || error },
        statusCode: 403,
      }));
    });

export const scrape_duolingo = (evt, ctx, cb) =>
  parseUserName(evt)
    .then(username => duolingo.scrape_profile(username))
    .tap(data => logger.info('User', data))
    .then(data => cb(null, createResponse({ body: { data, error: null } })))
    .catch((error) => {
      logger.error(error);
      return cb(null, createResponse({
        body: { data: null, error: error.message || error },
        statusCode: 403,
      }));
    });
