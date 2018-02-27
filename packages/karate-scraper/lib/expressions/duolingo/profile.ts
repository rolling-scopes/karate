const DUOLINGO = 'https://www.duolingo.com'

const SELECTORS = {
  profileLanguageSelector: '.profile-language',
  languageNameSelector: '.language-name',
  statSelector: '.substat',
}

interface Language {
  name: string
  nextLevel: string
  total: string
}

export interface Profile {
  userName: string
  languages: Language[]
}

export interface ProfileSelector {
  profileLanguageSelector: string
  languageNameSelector: string
  statSelector: string
}

const createProfileExpression = ({
  profileLanguageSelector,
  languageNameSelector,
  statSelector,
}: ProfileSelector) =>
  `const d = async () => {
    const delay = function (timeout) {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve();
        }, timeout);
      });
    };

    await delay(2000);

    return [...document.querySelectorAll('.profile-language')]
      .map(l => ({
        name: l.querySelector('.language-name').innerHTML,
        nextLevel: l.querySelectorAll('.substat')[0].innerHTML,
        total: l.querySelectorAll('.substat')[1].innerHTML
      }));
  };
  d().then(res => JSON.stringify(res));`

export const expression = () => createProfileExpression(SELECTORS)
export const url = ({ userName }) => `${DUOLINGO}/${userName}`
