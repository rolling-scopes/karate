import { DynamoDB } from 'aws-sdk'
import * as crypto from 'crypto'

const client = new DynamoDB.DocumentClient({
  region: process.env.region,
})

const getTaskId = ({ url, expression }) =>
  crypto
    .createHash('sha256')
    .update(`${url}${expression}`, 'utf8')
    .digest('hex')

export const getLatest = (task_id: string) =>
  client
    .query({
      TableName: String(process.env.task_table),
      KeyConditionExpression: '#task_id = :task_id and #timestamp <= :now',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#task_id': 'task_id',
      },
      ExpressionAttributeValues: {
        ':now': Date.now(),
        ':task_id': task_id,
      },
      Limit: 1,
    })
    .promise()

export const add = async (url: string, expression: string) => {
  const task_id = getTaskId({ url, expression })
  const item = { task_id, url, expression, timestamp: Date.now() }
  await client
    .put({
      TableName: String(process.env.task_table),
      Item: { ...item },
    })
    .promise()

  const { Items } = await getLatest(task_id)

  return Items[0] || []
}

export const update = ({ query, timestamp, value }) =>
  client
    .update({
      TableName: String(process.env.task_table),
      Key: {
        task_id: getTaskId(query),
        timestamp: Number(timestamp),
      },
      UpdateExpression: 'set #result = :result',
      ExpressionAttributeNames: {
        '#result': 'result',
      },
      ExpressionAttributeValues: {
        ':result': value,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
