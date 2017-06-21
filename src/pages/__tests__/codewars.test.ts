import * as scraper from '../../scraper'
import { katasExpression, katasAddr } from '../../pages/codewars'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

test('Scrape katas', async () => {
  const url = katasAddr('SiarheiMelnik')
  const data = await scraper.scrape({ url, expression: katasExpression, awaitPromise: true })
  const obj = data.result.value
  expect(JSON.parse(obj)).toContain('multiply')
})
