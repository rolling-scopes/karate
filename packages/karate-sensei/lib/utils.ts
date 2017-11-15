
export const createResponse = (statusCode: number, body?: any) => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: body ? JSON.stringify(body) : null,
})
