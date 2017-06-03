
import * as P from 'bluebird';
import * as Phantom from 'phantom';

const DUOLINGO = 'https://www.duolingo.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
const VIEWPORT = {
  width: 1024,
  height: 768,
};
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

function grabLanguages(profileSelector, languageNameSelector, statSelector): Language {
  return Array.prototype.slice.call(document.querySelectorAll(profileSelector))
    .map(function(l: HTMLElement) {
      return {
        name: l.querySelector(languageNameSelector).innerHTML,
        nextLevel: l.querySelectorAll(statSelector)[0].innerHTML,
        total: l.querySelectorAll(statSelector)[1].innerHTML,
      };
    });
}

export const scrape_profile = (userName: string) : Promise<Profile> =>
  P.coroutine(function * () {
    console.log('Init Scraper');

    const instance = yield Phantom.create(['--ignore-ssl-errors=true', '--load-images=no']);
    const page = yield instance.createPage();

    yield P.all([
      page.property('viewportSize', VIEWPORT),
      page.property('userAgent', USER_AGENT),
    ]);

    yield page.open(`${DUOLINGO}/${userName}`);

    const languages = yield page.evaluate(
      grabLanguages,
      SELECTORS.profileLanguage,
      SELECTORS.languageNameSelector,
      SELECTORS.statSelector,
    );

    yield instance.exit();

    return { userName, languages };
  })();
