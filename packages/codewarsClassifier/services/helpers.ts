import { CODEWARS_URL_START, CODEWARS_USERNAME_POSITION } from './config'

export function checkURL(maybeUrl: string) {
  if(maybeUrl && maybeUrl.indexOf(CODEWARS_URL_START) > -1) {
    return maybeUrl.split('/')[CODEWARS_USERNAME_POSITION];
  } else {
    return maybeUrl;
  }
}