import * as crypto from 'crypto'
import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

export const get = async (taskId) => {
  const params = {
    TableName: String(process.env.result_table),
    Key: { 'id': taskId }
  }

  return await client.get(params).promise()
}

export const update = async ({ query, data }) => {
  const id = crypto.createHash('sha256').update(`${query.url}${query.expression}`, 'utf8').digest('hex')

  const params = {
    TableName: String(process.env.result_table),
    Key: { 'id': id },
    UpdateExpression: 'set result = :r',
    ExpressionAttributeValues: {
      ':r': data
    },
    ReturnValues: 'UPDATED_NEW'
  }

  console.log(params)

  return await client.update(params).promise()
}
