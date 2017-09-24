import * as scraper from '../../../../lib/scraper'
import { katasExpression as expression, katasAddr } from '../../pages/codewars'

test('Scrape katas', async () => {
  const url = katasAddr('SiarheiMelnik')
  console.log(url, expression)
  const data = await scraper.scrape({ url, expression })
  const value = data.result.value
  expect(JSON.parse(value)).toContain('multiply')
})
