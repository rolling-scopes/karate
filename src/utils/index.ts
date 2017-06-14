import * as P from 'bluebird';

export const createResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(body),
});

export const parseUserName = req =>
  P.attempt(() => {
    const { username } = JSON.parse(req.body);

    if (!username) {
      throw new Error('username is empty');
    }

    return username;
  });

