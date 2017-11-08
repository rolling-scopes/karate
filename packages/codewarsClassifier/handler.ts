import { classify } from './services/classifier'
import { writeToSheet } from './services/sheetWriter'

export const createResponse = (statusCode, body?) => ({
  statusCode,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: body ? JSON.stringify(body) : null,
})


export const evaluate = async (evt, ctx, cb) => {
    const { userName, katas } = JSON.parse(evt.body)
    const response = {
        body: {
            userName,
            message: ''
        }
    }
    writeToSheet(userName, classify(katas))
        .then(data => {
            response.body.message = data;
            cb(null, createResponse(200, response.body));
        }).catch(err => {
            response.body.message = err;
            cb(null, createResponse(400, response.body))
        });
}