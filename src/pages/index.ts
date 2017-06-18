import * as P from 'bluebird'
import {
  katasExpression,
  katasAddr
} from './codewars'
import {
  profileExpression,
  profileAddr
} from './duolingo'

export default (pageId, userName) =>
  P.attempt(() => {
    if (pageId === 'katas') return { url: katasAddr(userName), expression: katasExpression }
    if (pageId === 'duolingo') return { url: profileAddr(userName), expression: profileExpression }
    throw new Error('pageId not fond')
  })
