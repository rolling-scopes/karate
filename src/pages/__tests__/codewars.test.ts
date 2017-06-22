import * as scraper from '../../scraper'
import { katasExpression, katasAddr } from '../../pages/codewars'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000

test('Scrape katas', async () => {
  const url = katasAddr('telukigor')
  const data = await scraper.scrape({ url, expression: katasExpression, awaitPromise: true })
  const obj = data.result.value
  console.log(obj)
  expect(JSON.parse(obj)).toContain('multiply')
})
