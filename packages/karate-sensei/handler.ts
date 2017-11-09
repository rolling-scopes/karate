import 'request'
import rq from 'request-promise-native'
import { StepFunctions } from 'aws-sdk'
import { createResponse } from './lib/utils'

const stepfunctions = new StepFunctions();
const entrypoint = 'https://skjivf6gw0.execute-api.eu-west-1.amazonaws.com'

export const startCodewarsKatas = async (evt, ctx, cb) => {
  try {
    const { users } = JSON.parse(evt.body)

    const stateMachineArn = process.env.statemachine_arn

    await Promise.all(
      users.map(user => stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify({ user })
      }).promise())
    )
    cb(null, createResponse(200, { message: 'started'}))
  } catch (e) {
    cb(null, createResponse(400, { message: e.message }))
  }
}

export const findExpression = async (evt, ctx, cb) => {
  try {
    const body = {
      "pageName": "katas",
      "meta": { "userName": evt.user}
    };

    const data = await rq({
      method: 'POST',
      uri: `${entrypoint}/test/expression`,
      body,
      json: true
    });

    cb(null, { data });
  } catch (e) {
    cb(e)
  }
}

export const scrapeKatas = async (evt, ctx, cb) => {
  try {
    const data = await rq({
      method: 'POST',
      uri: `${entrypoint}/test/tasks`,
      body: {
        ...evt.data
      },
      json: true
    });

    cb(null, { data });
  } catch (e) {
    cb(e)
  }
}
