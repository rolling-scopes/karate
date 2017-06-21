
const CODEWARS = 'https://www.codewars.com'

const SELECTORS = {
  solvedKatasSelector: '.list-item.kata .item-title a'
}
export interface KatasSelector {
  solvedKatasSelector: string
}

const createKatasExpression = ({ solvedKatasSelector }: KatasSelector) =>
  `
    const d = new Promise((resolve, reject) => {
      const grabKatas = solvedKataSelector =>
        [...document.querySelectorAll(solvedKataSelector)]
          .map(el => el.innerHTML)
          .map(text => text.toLowerCase().trim());
      const getPageHeight = () => document.body.scrollHeight;

      const scrollTo = height => document.body.scrollTop = height;

      const hasNotKatas = solvedKataSelector =>
        document.querySelectorAll(solvedKataSelector).length === 0;

      const delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));

      scrollTo(getPageHeight());

      if (hasNotKatas('${solvedKatasSelector}')) return reject(new Error('has not katas'));

      const waitUntilMultiplyIsReady = () =>
        new Promise((resolve) => {
          const katas = grabKatas('${solvedKatasSelector}');

          console.log(katas);

          if (katas.indexOf('multiply') !== -1) return resolve();

          scrollTo(getPageHeight());

          delay(300)
            .then(() => waitUntilMultiplyIsReady().then(resolve));
        });

        return waitUntilMultiplyIsReady()
          .then(() => {
            const solved = grabKatas('${solvedKatasSelector}');
            resolve(solved);
          });
    });
    d.then(res => JSON.stringify(res));
  `
export const katasExpression = createKatasExpression(SELECTORS)
export const katasAddr = (userName: string) => `${CODEWARS}/users/${userName}/completed`
