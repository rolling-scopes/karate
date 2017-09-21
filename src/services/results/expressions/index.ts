import * as katas from './codewars/katas'
import * as profile from './duolingo/profile'

export default (pageName, meta) => {
  switch (pageName) {
    case 'katas':
      return {
        url: katas.url(meta),
        expression: katas.expression(),
      }
    case 'duolingo':
      return {
        url: profile.url(meta),
        expression: profile.expression(),
      }
    default:
      return {
        url: 'empty',
        expression: 'empty',
      }
  }
}
