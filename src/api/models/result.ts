import { DynamoDB } from 'aws-sdk'

const client = new DynamoDB.DocumentClient({
  region: process.env.region
})

export const get = (taskId) => {
  const params = {
    TableName: String(process.env.result_table),
    Key: {
      'id': taskId
    }
  }

  return client.get(params).promise()
}
