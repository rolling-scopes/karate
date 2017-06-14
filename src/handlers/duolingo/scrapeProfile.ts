import * as AWS from 'aws-sdk';
import * as pages from '../../pages';
import { createResponse, parseUserName } from '../../utils';

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

export const scrapeProfile = async (evt, ctx, cb) => {
  const username = await parseUserName(evt);

  const url = pages.profileAddr(username);
  const expression = pages.profileExpression;

  const params = {
    FunctionName: process.env.scraper,
    InvocationType: 'Event',
    Payload: JSON.stringify({ url, expression, awaitPromise: false }),
  };

  const res = await lambda.invoke(params).promise();

  cb(null, createResponse(200, res));
};
