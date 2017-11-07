import * as chrome from '@serverless-chrome/lambda'
import * as CDP from 'chrome-remote-interface'
import logger from './logger';

export interface Result {
  value: string; url: string; expression: string; timestamp: number
}
let isStarted = false;

export const scrape = async ({ url, expression, timestamp }: { url: string; expression: string; timestamp: number }): Promise<Result> => {
  if (!isStarted) {
    await chrome({
      flags: ['--window-size=1280x1696', '--ignore-certificate-errors'],
    })
    isStarted = true
  }

  const target = await CDP.New()

  const client = await CDP({ host: '127.0.0.1', target })

  const { Page, Runtime } = client

  await Promise.all([Page.enable(), Runtime.enable()])

  await Page.navigate({ url })
  await Page.loadEventFired()

  const result = await Runtime.evaluate({ expression, awaitPromise: true })

  try {
    logger.info('Close the tab')
    await CDP.Close({ id: target.id })
  } catch (e) {
    logger.error(e)
  }

  await client.close()

  return {
    url,
    expression,
    timestamp,
    value: result.value || null,
  }
}
