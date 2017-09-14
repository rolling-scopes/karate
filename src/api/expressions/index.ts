import * as katas from './codewars/katas'
import * as profile from './duolingo/profile'

export default (pageName, meta) => {
  if (pageName === 'katas') {
    return {
      url: katas.url(meta),
      expression: katas.expression()
    }
  }
  if (pageName === 'duolingo') {
    return {
      url: profile.url(meta),
      expression: profile.expression()
    }
  }
  return {
    url: 'empty', expression: 'empty'
  }
}
