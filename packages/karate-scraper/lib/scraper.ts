import * as chrome from '@serverless-chrome/lambda'
import * as CDP from 'chrome-remote-interface'

export interface Result {
  result: { value: string }
}
export interface Scrape {
  (query: { url: string; expression: string }): Promise<Result>
}

const CHROME_OPTIONS = {
  flags: ['--window-size=1280x1696', '--ignore-certificate-errors'],
}

export const scrape: Scrape = async ({ url, expression }) => {
  await chrome(CHROME_OPTIONS)

  const target = await CDP.New()
  const client = await CDP({ target })

  const { Page, Runtime } = client

  await Promise.all([Page.enable(), Runtime.enable()])

  await Page.navigate({ url })
  await Page.loadEventFired()

  const result = await Runtime.evaluate({ expression, awaitPromise: true })
  const { id } = client.target
  await CDP.Close({ id })

  return result
}
