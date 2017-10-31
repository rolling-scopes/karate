const CODEWARS = 'https://www.codewars.com'

const SELECTORS = {
  solvedKatasSelector: '.list-item.kata .item-title a',
}
export interface KatasSelector {
  solvedKatasSelector: string
}

const createKatasExpression = ({ solvedKatasSelector }: KatasSelector) =>
  `const d = async () => {
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    const grabKatas = solvedKataSelector =>
      [...document.querySelectorAll(solvedKataSelector)]
        .map(el => el.innerHTML)
        .map(text => text.toLowerCase().trim());

    const getPageHeight = () => document.body.scrollHeight;

    const delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));

    const hasNotKatas = solvedKataSelector =>
      document.querySelectorAll(solvedKataSelector).length === 0;

    if (hasNotKatas('.list-item.kata .item-title a')) throw new Error('has not katas');

    const waitUntilMultiplyIsReady = async () => {
      let previousHeight;
      let currentHeight = 0;
      const now = Date.now();

      while (previousHeight !== currentHeight ||  Date.now() - now > 230000) {
        previousHeight = currentHeight;
        currentHeight = getPageHeight();
        window.scrollTo(0, currentHeight);
        await delay(random(1000, 3000));
      };
    };

    await waitUntilMultiplyIsReady();

    return grabKatas('.list-item.kata .item-title a');
  };
  d().then(res => JSON.stringify(res))
  `
export const expression = () => createKatasExpression(SELECTORS)
export const url = ({ userName }) => `${CODEWARS}/users/${userName}/completed`
