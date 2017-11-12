import { StepFunctions } from 'aws-sdk'
import * as api from './lib/api'
import { createResponse } from './lib/utils'

const stepfunctions = new StepFunctions();

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

export const findKatasExpression = async (evt, ctx, cb) => {
  try {
    const data = await api.findExpression('katas', evt);
    cb(null, { data });
  } catch (e) {
    cb(e)
  }
}

export const addScrapeTask = async (evt, ctx, cb) => {
  try {
    const data = await api.addScrapeTask(evt)
    cb(null, { data });
  } catch (e) {
    cb(e)
  }
}

export const getResults = async (evt, ctx, cb) => {
  try {
    const { statusCode, data } = await api.getResults(evt)
    cb(null, { statusCode, data });
  } catch (e) {
    cb(e)
  }
}

export const sentResults = async (evt, ctx, cb) => {
  try {
    console.log(evt);
    cb(null);
  } catch (e) {
    cb(e)
  }
}
