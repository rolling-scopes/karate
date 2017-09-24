import * as BPromise from 'bluebird'
import * as CDP from 'chrome-remote-interface'

export interface Result {
  result: { value: string }
}
export interface Scrape {
  (query: { url: string; expression: string }): Promise<Result>
}

export const scrape: Scrape = async ({ url, expression }) => {
  const target = await CDP.New()
  const client = await CDP({ target })

  const { Page, Runtime } = client

  await BPromise.all([Page.enable(), Runtime.enable()])

  await Page.navigate({ url })
  await Page.loadEventFired()

  const result = await Runtime.evaluate({ expression, awaitPromise: true })
  const { id } = client.target
  await CDP.Close({ id })

  return result
}
