import * as crypto from 'crypto'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk-core'

const { DynamoDB } = AWSXRay.captureAWS(AWS)
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
      Item: {
        task_id,
        url,
        expression,
      },
    }).promise()

  const { Item } = await client
    .get({
      TableName: String(process.env.task_table),
      Key: { task_id },
    })
    .promise()

  return Item.task_id
}

export const get = async task_id => {
  return await client
  .get({
    TableName: String(process.env.task_table),
    Key: { task_id },
  }).promise()
}

export const update = async ({ query, value }) => {
  const task_id = getTaskId(query)

  return await client.update({
    TableName: String(process.env.task_table),
    Key: { task_id },
    UpdateExpression: 'set res = :r',
    ExpressionAttributeValues: { ':r': value },
    ReturnValues: 'UPDATED_NEW',
  }).promise()
}
