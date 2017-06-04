
import * as P from 'bluebird';
import * as scrapper from '../../scrapper';

const CODEWARS_URL = 'https://www.codewars.com';
const SELECTORS = {
  solvedKatas: '.list-item.kata .item-title a',
  totalKatas: '.tabs.is-vertical .is-active a',
};

export interface KatasScore {
  userName: string;
  solved: string[];
  total: number;
}

function grabCompletedKatas(solvedKataSelector, totalKatasSelector) {
  return `
    const d = new Promise((resolve, reject) => {
      const grabKatas = solvedKataSelector =>
        [...document.querySelectorAll(solvedKataSelector)]
          .map(el => el.innerHTML)
          .map(text => text.toLowerCase().trim());

      const grabTotal = totalKatasSelector =>
        ${new RegExp(/\d+/g)}.exec(document.querySelector('${totalKatasSelector}').innerHTML)[0];

      const getPageHeight = () => document.body.scrollHeight;

      const scrollTo = height => document.body.scrollTop = height;

      const hasNotKatas = solvedKataSelector =>
        document.querySelectorAll(solvedKataSelector).length === 0;

      const delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));

      scrollTo(getPageHeight());

      if (hasNotKatas('${solvedKataSelector}')) return reject(new Error('has not katas'));

      const waitUntilMultiplyIsReady = () =>
        new Promise((resolve) => {
          const katas = grabKatas('${solvedKataSelector}');

          if (katas.indexOf('multiply') !== -1) return resolve();

          scrollTo(getPageHeight());

          delay(100)
            .then(() => waitUntilMultiplyIsReady().then(resolve));
        });

        waitUntilMultiplyIsReady()
          .then(() => {
            const solved = grabKatas('${solvedKataSelector}');
            const total = grabTotal('${totalKatasSelector}');
            resolve({ total, solved });
          });
    });
    d.then(res => JSON.stringify(res));
  `;
}

export const katas = (userName: string) : Promise<KatasScore> =>
    P.coroutine(function * () {
      const url = `${CODEWARS_URL}/users/${userName}/completed`;
      const exp = grabCompletedKatas(
        SELECTORS.solvedKatas,
        SELECTORS.totalKatas,
      );
      const res = yield scrapper.scrape(url, exp, true);
      const data = JSON.parse(res.result.value);

      return { userName, ...data };
    })();
