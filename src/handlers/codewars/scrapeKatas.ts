import * as AWS from 'aws-sdk';
import * as pages from '../../pages';
import { createResponse, parseUserName } from '../../utils';

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

export const scrapeKatas = async (evt, ctx, cb) => {
  try {
    const username = await parseUserName(evt);

    const url = pages.katasAddr(username);
    const expression = pages.katasExpression;

    const params = {
      FunctionName: process.env.scraper,
      InvocationType: 'Event',
      Payload: JSON.stringify({ url, expression, awaitPromise: true }),
    };

    const res = await lambda.invoke(params).promise();
    console.log(res);
    cb(null, createResponse(200, { a: 4 }));
  } catch (e) {
    cb(null, createResponse(500, { error: e.message }));
  }
};
