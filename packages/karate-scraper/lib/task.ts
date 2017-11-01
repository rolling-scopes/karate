import * as crypto from 'crypto'
import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

const getTaskId = ({ url, expression }) =>
  crypto
    .createHash('sha256')
    .update(`${url}${expression}`, 'utf8')
    .digest('hex')

export const getLatest = task_id =>
  client
    .query({
      TableName: String(process.env.task_table),
      KeyConditionExpression: '#task_id = :task_id',
      FilterExpression: '#timestamp <= :now',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#task_id': 'task_id'
      },
      ExpressionAttributeValues: {
        ':task_id' : task_id,
        ':now': Date.now()
      },
      Limit: 1
    })
    .promise()

export const add = async (url: string, expression: string) => {
  const task_id = getTaskId({ url, expression })

  await client
    .put({
      TableName: String(process.env.task_table),
      Item: { task_id, url, expression, timestamp: Date.now() },
    })
    .promise()

  const { Items } = await getLatest(task_id)

  return Items[0] || []
}

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
