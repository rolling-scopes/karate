import { v4 } from 'uuid'
import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

export const add = async (url, expression) => {
  const params = {
    TableName: String(process.env.task_table),
    Item: {
      'id': v4(),
      'url': url,
      'expression': expression
    }
  }

  return await client.put(params).promise()
}
