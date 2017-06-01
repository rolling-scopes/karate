
import * as P from 'bluebird';
import * as Phantom from 'phantom';

const CODEWARS_URL = 'https://www.codewars.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
const VIEWPORT = {
  width: 1024,
  height: 10240,
};
const SELECTORS = {
  loaderMarker: '.js-infinite-marker',
  solvedKatas: '.list-item.kata .item-title a',
  totalKatas: '.has-tip.tip-right.is-active a',
};

export interface KatasScore {
  userName: string;
  solved: Array<string>;
  total: number;
}

function grabKatas(solvedKataSelector: string) : Array<string> {
  return Array.prototype.slice.call(document.querySelectorAll(solvedKataSelector))
    .map(function(el: HTMLElement) { return el.innerHTML; })
    .map(function(text: string) { return text.toLowerCase().trim(); });
};
function grabTotal(totalKatasSelector: string) : number {
  return +/\((.*?)\)/gi.exec(document.querySelector(totalKatasSelector).innerHTML)[1];
};
function getPageHeight(): number { return document.body.scrollHeight; }
function isLoader(loaderSelector): boolean { return document.querySelectorAll(loaderSelector).length === 1; }
function scrollTo(height): void { return document.body.scrollTop = height; }
function hasNotKatas(katasSelector): boolean { return document.querySelectorAll(katasSelector).length === 0; };

export const scrape_katas = (userName: string) : Promise<KatasScore> =>
    P.coroutine(function * () {
      console.log('Init Scraper');
      const instance = yield Phantom.create(['--ignore-ssl-errors=true', '--load-images=no']);
      const page = yield instance.createPage();

      yield P.all([
        page.property('viewportSize', VIEWPORT),
        page.property('userAgent', USER_AGENT),
      ]);

      yield page.open(`${CODEWARS_URL}/users/${userName}/completed`);

      yield P.delay(1000);

      const bodyHeight = yield page.evaluate(getPageHeight);

      yield page.evaluate(scrollTo, bodyHeight);

      const isNotKatas = yield page.evaluate(hasNotKatas, SELECTORS.solvedKatas);

      if (isNotKatas) {
        yield instance.exit();
        throw new Error('User doesn"t have katas');
      }

      const isScroll = yield page.evaluate(isLoader, SELECTORS.loaderMarker);

      if (isScroll) {
        console.log('Scrolling');
        let previousHeight;
        let currentHeight = 0;
        while (previousHeight !== currentHeight) {
          previousHeight = currentHeight;
          currentHeight = yield page.evaluate(getPageHeight);
          yield page.evaluate(scrollTo, currentHeight + 200);
          yield P.delay(4000);
        }
      }

      const [total, solved] = yield P.all([
        page.evaluate(grabTotal, SELECTORS.totalKatas),
        page.evaluate(grabKatas, SELECTORS.solvedKatas),
      ]);

      yield instance.exit();

      return { solved, total, userName };
    })();
