import * as P from 'bluebird'
import * as CDP from 'chrome-remote-interface'
import * as chrome from '@serverless-chrome/lambda'

const CHROME_FLAGS = [
  '--window-size=1280x1696',
  '--hide-scrollbars'
]
export interface ScrapeQuery {
  url: string
  expression: string
  awaitPromise?: boolean
}

export const scrape = async ({ url, expression, awaitPromise = false }: ScrapeQuery) => {
  await chrome({ flags: [...CHROME_FLAGS] })

  const target = await CDP.New()

  const client = await CDP({ target })

  const { Page, Runtime } = client

  const loadEventFired = Page.loadEventFired()

  await P.all([Page.enable(), Runtime.enable()])

  await Page.navigate({ url })

  await new P(resolve => loadEventFired.then(() => setTimeout(resolve, 2000)))

  const result = await Runtime.evaluate({ expression, awaitPromise })

  const id = client.target.id

  await CDP.Close({ id })

  return result
}
