import * as chrome from '@serverless-chrome/lambda'
import * as CDP from 'chrome-remote-interface'
import logger from './logger';

export interface Result {
  url: string;
  expression: string;
  timestamp: number;
  value: string | null;
}
interface ScrapeQuery {
  url: string;
  expression: string;
  timestamp: number;
}
let isStarted = false;

export const scrape = async ({ url, expression, timestamp }: ScrapeQuery): Promise<Result> => {
  if (!isStarted) {
    await chrome({
      flags: ['--window-size=1280x1696', '--ignore-certificate-errors'],
    })
    isStarted = true
  }

  const target = await CDP.New()

  const client = await CDP({ host: '127.0.0.1', target })

  const { Page, Runtime, Emulation } = client

  const width = 2000
  const height = 2000

  await Emulation.setDeviceMetricsOverride({
    width,
    height,
    mobile: true,
    deviceScaleFactor: 1,
    fitWindow: false,
    screenWidth: width,
    screenHeight: height
  });

  await Emulation.setVisibleSize({
    width,
    height
  });

  await Promise.all([Page.enable(), Runtime.enable()])

  await Page.navigate({ url })
  await Page.loadEventFired()

  logger.info('Expression: ', { expression })

  const { result } = await Runtime.evaluate({ expression, awaitPromise: true })

  logger.info('Result: ', { result })

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
