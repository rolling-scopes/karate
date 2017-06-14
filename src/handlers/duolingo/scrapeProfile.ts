import * as AWS from 'aws-sdk';
import * as pages from '../../pages';
import { createResponse, parseUserName } from '../../utils';
import logger from '../../logger';

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

export const scrapeProfile = async (evt, ctx, cb) => {
  try {
    const userName = await parseUserName(evt);

    logger.info(userName);

    const url = pages.profileAddr(userName);
    const expression = pages.profileExpression;

    const params = {
      FunctionName: process.env.scraper,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ url, expression, awaitPromise: false }),
    };

    const { Payload } = await lambda.invoke(params).promise();

    const data = JSON.parse(Payload.toString());

    logger.info(data);

    cb(null, createResponse(200, {
      userName,
      profile: JSON.parse(data.result.value),
    }));
  } catch (e) {
    cb(null, createResponse(500, { error: e.message }));
  }
};
