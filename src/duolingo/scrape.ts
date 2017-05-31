
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

function grabLanguages(): Language {
  return Array.prototype.slice.call(document.querySelectorAll('.profile-language'))
    .map(function (language) {
      return {
        name: language.querySelector('.language-name').innerHTML,
        nextLevel: language.querySelectorAll('.substat')[0].innerHTML,
        total: language.querySelectorAll('.substat')[1].innerHTML,
      };
    });
};

export const scrape_profile = (userName: string) : Promise<Profile> =>
  P.coroutine(function * () {
    console.log('Init Scraper');
    const instance = yield Phantom.create(['--ignore-ssl-errors=true']);
    const page = yield instance.createPage();

    yield P.all([
      page.property('viewportSize', VIEWPORT),
      page.property('userAgent', USER_AGENT),
    ]);

    yield page.open(`${DUOLINGO}/${userName}`);

    yield P.delay(3000);

    const languages = yield page.evaluate(grabLanguages);

    console.log(languages);

    yield instance.exit();

    return { userName, languages };
  });
