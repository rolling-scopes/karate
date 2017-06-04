
import * as P from 'bluebird';
import * as CDP from 'chrome-remote-interface';

function * scrape(url, expression) {
  let loaded = false;
  const LOAD_TIMEOUT = 1000 * 60;

  const loading = P.coroutine(function * (startTime = Date.now()) {
    if (!loaded && Date.now() - startTime < LOAD_TIMEOUT) {
      yield P.delay(100);
      yield loading(startTime);
    }
  });

  const [target] = yield CDP.List();
  const client = yield CDP({ host: '127.0.0.1', target });

  const { Page, Runtime } = client;

  Page.loadEventFired(() => {
    loaded = true;
  });

  yield P.all([Page.enable(), Runtime.enable()]);

  yield Page.navigate({ url });

  yield loading();

  const result = yield Runtime.evaluate({ expression });

  yield client.close();

  return result;
}

export const test_cdp = (url, exp) =>
  P.coroutine(scrape)(url, exp);
