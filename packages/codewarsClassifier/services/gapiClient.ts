const key = require('../client_secret.json')
const google = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

export function getJwtClient() {
    return new google.auth.JWT(
      key.client_email,
      '../key.pem',
      key.private_key,
      SCOPES,
      null
    )
}
