
import * as P from 'bluebird';
import * as CDP from 'chrome-remote-interface';

export const scrape = (url, expression, awaitPromise = false) =>
  P.coroutine(function * (url, expression) {
    const target = yield CDP.New();
    const client = yield CDP({ target });

    const { Page, Runtime } = client;

    const loadEventFired = Page.loadEventFired();

    yield P.all([
      Page.enable(),
      Runtime.enable(),
    ]);

    yield Page.navigate({ url });

    yield new P((resolve) => {
      loadEventFired.then(() => {
        setTimeout(resolve, 1000);
      });
    });

    const result = yield Runtime.evaluate({ expression, awaitPromise });

    const id = client.target.id;
    yield CDP.Close({ id });

    return result;
  })(url, expression);
