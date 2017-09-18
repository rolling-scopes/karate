import * as crypto from 'crypto'
import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

export const add = async (url, expression) => {
  const id = crypto.createHash('sha256').update(`${url}${expression}`, 'utf8').digest('hex')
  const params = {
    TableName: String(process.env.task_table),
    Item: {
      'id': id,
      'url': url,
      'expression': expression
    }
  }

  await client.put(params).promise()

  return await client.get({
    TableName: String(process.env.task_table),
    Key: { 'id': id }
  }).promise()
}
