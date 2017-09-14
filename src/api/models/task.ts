import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

export const add = (pageId, expression) => {
  const params = {
    TableName: String(process.env.task_table),
    Item: {
      'page_id': pageId,
      'expression': expression
    }
  }

  return client.put(params).promise()
}
