import * as P from 'bluebird'
import * as CDP from 'chrome-remote-interface'
import * as chrome from '@serverless-chrome/lambda'

const CHROME_OPTIONS = {
  flags: [
    '--window-size=1024x768'
  ]
}
export interface ScrapeQuery {
  url: string
  expression: string
  awaitPromise?: boolean
}

export const scrape = async ({ url, expression, awaitPromise = false }: ScrapeQuery) => {
  await chrome(CHROME_OPTIONS)

  const target = await CDP.New()

  const client = await CDP({ target })

  const { Page, Runtime } = client

  await P.all([
    Page.enable(),
    Runtime.enable()
  ])

  await Page.navigate({ url })

  await Page.loadEventFired()

  await P.delay(1000)

  const result = await Runtime.evaluate({ expression, awaitPromise })

  const { id } = client.target

  await CDP.Close({ id })

  return result
}
