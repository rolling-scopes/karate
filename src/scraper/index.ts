import * as P from 'bluebird'
import * as CDP from 'chrome-remote-interface'
import * as chrome from '@serverless-chrome/lambda'

const CHROME_OPTIONS = {
  flags: [
    '--window-size=1280x1696',
    '--disable-gpu',
    '--incognito'
  ]
}
export interface ScrapeQuery {
  url: string
  expression: string
  awaitPromise?: boolean
}

const LOAD_TIMEOUT = 300000

export const scrape = async ({ url, expression, awaitPromise = false }: ScrapeQuery) => {
  await chrome(CHROME_OPTIONS)

  let result

  const target = await CDP.New()

  const client = await CDP({ target })

  const { Page, Runtime } = client

  try {
    await P.all([Page.enable(), Runtime.enable()])

    const loadEventFired = Page.loadEventFired()

    await Page.navigate({ url })

    await new P((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Page load timed out after ${LOAD_TIMEOUT} ms.`)), LOAD_TIMEOUT)
      loadEventFired.then(() => {
        clearTimeout(timeout)
        resolve()
      })
    })

    result = await Runtime.evaluate({ expression, awaitPromise })
  } catch (e) {
    console.log(e)
  }

  const id = client.target.id

  await CDP.Close({ id })

  return result
}
