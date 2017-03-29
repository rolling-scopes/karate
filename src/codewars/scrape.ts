
import * as P from 'bluebird';
import * as Phantom from 'phantom';

const CODEWARS_URL = 'https://www.codewars.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
const VIEWPORT = {
    width: 1024,
    height: 1024
};
const LOADING_TIMEOUT = 300;
const SELECTORS = {
    loaderMarker: '.js-infinite-marker',
    solvedKatas: '.list-item.kata .item-title a',
    totalKatas: '.has-tip.tip-right.is-active a'
}

export interface KatasScore {
    userName: string,
    solved: Array<string>,
    total: number
}

function grabKatas(userName: string, solvedKataSelector: string, totalKatasSelector: string) : KatasScore {
    return {
        userName: userName,
        solved: Array.prototype.slice.call(document.querySelectorAll(solvedKataSelector))
            .map(function(el: HTMLElement) { return el.innerHTML; })
            .map(function(text: string) { return text.toLowerCase().trim(); }),
        total: +/\((.*?)\)/gi.exec(document.querySelector(totalKatasSelector).innerHTML)[1],
    };
};

function isLoader(loaderSelector): boolean { return document.querySelectorAll(loaderSelector).length === 1; }
function getPageHeight(): number { return document.body.scrollHeight; }
function scrollTo(height): void { return document.body.scrollTop = height; }
function hasNotKatas(katasSelector): boolean { return document.querySelectorAll(katasSelector).length === 0; };

export const scrape_katas = (userName: string) : Promise<KatasScore> =>
    P.coroutine(function * () {
        console.log('Init Scraper');
        const instance = yield Phantom.create(['--ignore-ssl-errors=true']);
        const page = yield instance.createPage();

        yield * [
            page.property('viewportSize', VIEWPORT),
            page.property('userAgent', USER_AGENT)
        ];
  
        yield page.open(`${CODEWARS_URL}/users/${userName}/completed`);

        yield P.delay(LOADING_TIMEOUT);

        yield page.evaluate(scrollTo, 0);

        const isNotKatas = yield page
            .evaluate(hasNotKatas, SELECTORS.solvedKatas);
        
        if (isNotKatas) {
            yield instance.exit();
            throw new Error('User doesn"t have katas');
        }

        const isScroll = yield page
            .evaluate(isLoader, SELECTORS.loaderMarker);
        
        if (isScroll) {
            console.log('Scrolling');

            let previousHeight;
            let currentHeight = 0;
            while (previousHeight !== currentHeight) {
                previousHeight = currentHeight;
                currentHeight = yield page
                    .evaluate(getPageHeight);
                yield page
                    .evaluate(scrollTo, currentHeight);
                yield P.delay(LOADING_TIMEOUT);
            }
        }

        console.log('Get result');

        const res = yield page
            .evaluate(grabKatas, userName, SELECTORS.solvedKatas, SELECTORS.totalKatas);
        yield instance.exit();

        return res;
    })();