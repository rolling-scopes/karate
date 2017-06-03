
import * as P from 'bluebird';
import * as CDP from 'chrome-remote-interface';

import chrome from '../../browser/chrome';

export const test_cdp = () =>
  P.coroutine(function * () {
    yield chrome();

    const [target] = yield CDP.List();
    const client = yield CDP({
      host: '127.0.0.1',
      target,
    });

    const { Network, Page } = client;

    yield P.all([
      Network.enable(),
      Page.enable(),
    ]);

    yield client.close();
  })();
