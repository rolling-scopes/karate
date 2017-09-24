import * as crypto from 'crypto'
import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region,
})

export const add = async (url, expression) => {
  const task_id = crypto
    .createHash('sha256')
    .update(`${url}${expression}`, 'utf8')
    .digest('hex')
  const params = {
    TableName: String(process.env.task_table),
    Item: {
      task_id,
      url,
      expression
    },
  }

  await client.put(params).promise()

  const { Item } = await client
    .get({
      TableName: String(process.env.task_table),
      Key: { task_id },
    })
    .promise()

  return Item.task_id
}

export const get = async task_id => {
  const params = {
    TableName: String(process.env.task_table),
    Key: { task_id },
  }

  return await client.get(params).promise()
}

export const update = async ({ query, value }) => {
  const task_id = crypto
    .createHash('sha256')
    .update(`${query.url}${query.expression}`, 'utf8')
    .digest('hex')

  const params = {
    TableName: String(process.env.task_table),
    Key: { task_id },
    UpdateExpression: 'set res = :r',
    ExpressionAttributeValues: { ':r': value },
    ReturnValues: 'UPDATED_NEW',
  }

  return await client.update(params).promise()
}
