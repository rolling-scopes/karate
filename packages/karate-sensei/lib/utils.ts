export const createResponse = (statusCode: number, body?: any) => ({
  statusCode,
  body: body ? JSON.stringify(body) : null,
})
