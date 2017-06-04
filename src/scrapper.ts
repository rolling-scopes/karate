
import * as P from 'bluebird';
import * as CDP from 'chrome-remote-interface';

const LOAD_TIMEOUT = 1000 * 60;
const HOST = '127.0.0.1';

export const scrape = (url, expression, awaitPromise = false) =>
  P.coroutine(function * (url, expression) {
    const [target] = yield CDP.List();
    const client = yield CDP({ host: HOST, target });

    const { Page, Runtime } = client;

    const loadEventFired = Page.loadEventFired();
    yield P.all([
      Page.enable(),
      Runtime.enable(),
    ]);

    yield Page.navigate({ url });

    yield new P((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(`Loading ${LOAD_TIMEOUT} ms`)),
        LOAD_TIMEOUT,
      );
      loadEventFired.then(() => {
        clearTimeout(timeout);
        resolve();
      });
    });

    yield P.delay(4000);

    const result = yield Runtime.evaluate({ expression, awaitPromise });

    yield client.close();

    return result;
  })(url, expression);
