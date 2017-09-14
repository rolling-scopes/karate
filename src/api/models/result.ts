import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

export const get = (pageId) => {
  const params = {
    TableName: String(process.env.result_table),
    Key: {
      'page_id': pageId
    }
  }

  return client.get(params).promise()
}
