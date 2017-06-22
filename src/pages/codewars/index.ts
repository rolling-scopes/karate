
const CODEWARS = 'https://www.codewars.com'

const SELECTORS = {
  solvedKatasSelector: '.list-item.kata .item-title a'
}
export interface KatasSelector {
  solvedKatasSelector: string
}

const createKatasExpression = ({ solvedKatasSelector }: KatasSelector) =>
  `const d = new Promise((resolve, reject) => {
    const grabKatas = solvedKataSelector =>
      [...document.querySelectorAll(solvedKataSelector)]
        .map(el => el.innerHTML)
        .map(text => text.toLowerCase().trim());
    const getPageHeight = () => document.body.scrollHeight;
    const delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    const hasNotKatas = solvedKataSelector =>
      document.querySelectorAll(solvedKataSelector).length === 0;

    if (hasNotKatas('${solvedKatasSelector}')) return reject(new Error('has not katas'));

    const waitUntilMultiplyIsReady = () =>
      new Promise(async (resolve) => {
        let previousHeight;
        let currentHeight = 0;
        const katas = grabKatas('.list-item.kata .item-title a')
        while (previousHeight !== currentHeight) {
          previousHeight = currentHeight;
          currentHeight = getPageHeight();
          window.scrollTo(0, currentHeight);
          await delay(getRandomInt(3000, 4000));
        }
        if (katas.indexOf('multiply') !== -1) resolve();
        waitUntilMultiplyIsReady().then(resolve);
      });

      waitUntilMultiplyIsReady()
        .then(() => {
          const katas = grabKatas('.list-item.kata .item-title a');
          resolve(katas);
        });
  });
  d.then(res => JSON.stringify(res));
  `
export const katasExpression = createKatasExpression(SELECTORS)
export const katasAddr = (userName: string) => `${CODEWARS}/users/${userName}/completed`
