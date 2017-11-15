import { StepFunctions, SNS } from 'aws-sdk'
import * as api from './lib/api'
import { createResponse } from './lib/utils'

const stepfunctions = new StepFunctions();
const sns = new SNS();

export const startScrape = async (evt: any, ctx: any, cb: any) => {
  try {
    const { pageName } = evt.pathParameters
    const { users } = JSON.parse(evt.body)

    if(!Array.isArray(users) || users.length < 0) throw new Error('Users list is required')

    const stateMachineArn = String(process.env.statemachine_arn)

    await Promise.all(
      users.map((userName: string) => stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify({ pageName, userName })
      }).promise())
    )
    cb(null, createResponse(200, { message: 'started' }))
  } catch (e) {
    console.log(e);
    cb(null, createResponse(400, { message: e.message }))
  }
}

export const findExpression = async (evt: any, ctx: any, cb: any) => {
  try {
    console.log(evt);
    const data = await api.findExpression(evt);
    cb(null, { ...data });
  } catch (e) {
    console.log(e);
    cb(e)
  }
}

export const addScrapeTask = async (evt: any, ctx: any, cb: any) => {
  try {
    console.log(evt);
    const data = await api.addScrapeTask(evt)
    cb(null, { ...data });
  } catch (e) {
    console.log(e);
    cb(e)
  }
}

export const getResults = async (evt: any, ctx: any, cb: any) => {
  try {
    console.log(evt);
    const data = await api.getResults(evt)
    cb(null, { ...data });
  } catch (e) {
    console.log(e);
    cb(e)
  }
}

export const sentResults = async (evt: any, ctx: any, cb: any) => {
  try {
    console.log(evt);
    await sns.publish({
      TopicArn: `${process.env.TOPIC_RESULTS}-${evt.pageName}`,
      Message: JSON.stringify(evt)
    }).promise()
    cb(null);
  } catch (e) {
    console.log(e);
    cb(e)
  }
}
