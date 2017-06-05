
import * as P from 'bluebird';
import * as scrapper from '../../scrapper';

const DUOLINGO = 'https://www.duolingo.com';
const SELECTORS = {
  profileLanguage: '.profile-language',
  languageNameSelector: '.language-name',
  statSelector: '.substat',
};

export interface Language {
  name: string;
  nextLevel: string;
  total: string;
}

export interface Profile {
  userName: string;
  languages: Language[];
}

function grabLanguages(profileSelector, languageNameSelector, statSelector) {
  return `JSON.stringify(
    [...document.querySelectorAll('${profileSelector}')]
      .map(l => ({
        name: l.querySelector('${languageNameSelector}').innerHTML,
        nextLevel: l.querySelectorAll('${statSelector}')[0].innerHTML,
        total: l.querySelectorAll('${statSelector}')[1].innerHTML
      }))
  );`;
}

export const profile = (userName: string) : Promise<Profile> =>
  P.coroutine(function * () {
    const url = `${DUOLINGO}/${userName}`;
    const exp = grabLanguages(
      SELECTORS.profileLanguage,
      SELECTORS.languageNameSelector,
      SELECTORS.statSelector,
    );

    const result = yield scrapper.scrape(url, exp);
    const languages = JSON.parse(result.result.value);

    return { userName, languages };
  })();
