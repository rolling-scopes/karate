
export const createResponse = ({ body = {}, statusCode = 200 }) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});
