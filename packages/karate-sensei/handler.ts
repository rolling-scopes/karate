import * as BPromise from 'bluebird'
import { StepFunctions, SNS } from 'aws-sdk'
import * as api from './lib/api'
import { createResponse } from './lib/utils'
import logger from './lib/logger'

const stepfunctions = new StepFunctions()
const sns = new SNS()

export const startGather = async (evt: any, ctx: any, cb: any) => {
  try {
    const { pageName } = evt.pathParameters
    const { users } = JSON.parse(evt.body)

    if (!Array.isArray(users) || users.length < 0)
      throw new Error('Users list is required')

    const stateMachineArn = String(process.env.statemachine_arn)

    logger.info(`page name ${pageName} and users ${users}`)

    await BPromise.map(
      users,
      (userName: string) =>
        stepfunctions
          .startExecution({
            stateMachineArn,
            input: JSON.stringify({ pageName, userName }),
          })
          .promise(),
      { concurrency: 10 },
    )

    cb(null, createResponse(200, { message: 'started' }))
  } catch (e) {
    logger.error(e)
    cb(e, createResponse(400, { message: e.message }))
  }
}

export const findExpression = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    const res = await api.findExpression(evt)

    logger.info('Result: ', res)
    cb(null, { ...res })
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const addScrapeTask = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    const res = await api.addScrapeTask(evt)

    logger.info('Result: ', res)
    cb(null, { ...res })
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const getResults = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    const res = await api.getResults(evt)

    logger.info('Result: ', res)
    cb(null, { ...res })
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const checkAddress = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    const res = await api.checkAddress(evt)

    logger.info('Result: ', res)
    cb(null, { ...evt })
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const getResolvedKatas = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    const firstResult = await api.getResolvedKatas(evt)
    let totalPages = Number(firstResult.totalPages);
    let katasIds = firstResult.data.map(d => ({ id: d.id }))

    totalPages = totalPages - 1;

    while (totalPages !== 0) {
      const nextResult = await api.getResolvedKatas(evt)
      katasIds.push(nextResult.data.map(d => ({ id: d.id })))
      totalPages = totalPages - 1;
    }

    logger.info('Result: ', katasIds)

    cb(null, { data: katasIds })
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const getKatasInfo = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    const { data } = evt

    const katas = await BPromise.map(data, kata =>
      api.getKatasInfo(kata).catch(e => logger.error(e, kata))
    , { concurrency: 15 })

    const res = katas
      .filter(k => typeof k !== 'undefined')
      .map(k => ({
        id: k.id,
        name: k.name,
        rank: k.rank.name,
      }))
      .filter(k => !!k.rank)

    logger.info('Result: ', res)
    cb(null, { data: res })
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const sentResults = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    await sns
      .publish({
        TopicArn: `${process.env.TOPIC_RESULTS}-${evt.pageName}`,
        Message: JSON.stringify(evt),
      })
      .promise()
    cb(null)
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}

export const sentErrors = async (evt: any, ctx: any, cb: any) => {
  try {
    logger.info('Event: ', evt)

    await sns
      .publish({
        TopicArn: `${process.env.TOPIC_ERRORS}`,
        Message: JSON.stringify(evt),
      })
      .promise()
    cb(null)
  } catch (e) {
    logger.error(e)
    cb(e)
  }
}
