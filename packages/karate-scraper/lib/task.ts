import * as crypto from 'crypto'
import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({ region: process.env.region })

const getTaskId = ({ url, expression }) =>
  crypto
    .createHash('sha256')
    .update(`${url}${expression}`, 'utf8')
    .digest('hex')

export const add = async (url: string, expression: string) => {
  const task_id = getTaskId({ url, expression })

  await client
    .put({
      TableName: String(process.env.task_table),
      Item: { task_id, url, expression, timestamp: Date.now() },
    })
    .promise()

  const { Item } = await client
    .get({
      TableName: String(process.env.task_table),
      Key: { task_id },
    })
    .promise()

  return Item.task_id
}

export const get = task_id =>
  client
    .get({
      TableName: String(process.env.task_table),
      Key: { task_id },
    })
    .promise()

export const update = ({ query, value }) =>
  client
    .update({
      TableName: String(process.env.task_table),
      Key: { task_id: getTaskId(query) },
      UpdateExpression: 'set res = :r',
      ExpressionAttributeValues: { ':r': value },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise()
