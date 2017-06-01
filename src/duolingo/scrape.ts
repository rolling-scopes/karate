
import * as P from 'bluebird';
import * as Phantom from 'phantom';

const DUOLINGO = 'https://www.duolingo.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
const VIEWPORT = {
  width: 1024,
  height: 1024,
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

const SELECTORS = {
  profileLanguage: '.profile-language',
  languageNameSelector: '.language-name',
  statSelector: '.substat',
  profile: '.profile-header-username',
};

function grabLanguages(profileSelector, languageNameSelector, statSelector): Language {
  return Array.prototype.slice.call(document.querySelectorAll(profileSelector))
    .map(function(language) {
      return {
        name: language.querySelector(languageNameSelector).innerHTML,
        nextLevel: language.querySelectorAll(statSelector)[0].innerHTML,
        total: language.querySelectorAll(statSelector)[1].innerHTML,
      };
    });
}

// function hasProfile(profileHeader) : boolean {
//   return document.querySelectorAll(profileHeader).length === 1;
// }

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
    yield P.delay(3000);

    // const knownUser = yield page.evaluate(hasProfile, SELECTORS.profile);
    //
    // if (!knownUser) {
    //   yield instance.exit();
    //   throw new Error('User doesn"t have profile');
    // }

    const languages = yield page.evaluate(
      grabLanguages,
      SELECTORS.profileLanguage,
      SELECTORS.languageNameSelector,
      SELECTORS.statSelector,
    );

    yield instance.exit();

    return { userName, languages };
  })();
