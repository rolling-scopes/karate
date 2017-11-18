import * as katas from './codewars/katas'
import * as profile from './duolingo/profile'

export default (pageName: string, meta: any) => {
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
      throw new Error('Page not found')
  }
}
