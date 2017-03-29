
import * as P from 'bluebird';
import * as Phantom from 'phantom';

const CODEWARS_URL = 'https://www.codewars.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
const VIEWPORT = {
    width: 1024,
    height: 1024
};

const LOADING_TIMEOUT = 3000;

export interface KatasScore {
    userName: string,
    solved: Array<string>,
    total: Number 
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

        yield P.delay(1000);

        const isScroll = yield page
            .evaluate(function() { return document.querySelectorAll('.js-infinite-marker').length === 1; });
        
        if (isScroll) {
            console.log('Scrolling');
            let previousHeight;
            let currentHeight = 0;
            while (previousHeight !== currentHeight) {
                previousHeight = currentHeight;
                currentHeight = yield page
                    .evaluate(function() { return document.body.scrollHeight; });
                yield page
                    .evaluate(function(currentHeight) { return document.body.scrollTop = currentHeight; }, currentHeight);
                yield P.delay(LOADING_TIMEOUT);
            }
        }

        console.log('Get result');

        const res = yield page
            .evaluate(grabKatas, userName, '.list-item.kata .item-title a', '.has-tip.tip-right.is-active a');
        yield instance.exit();

        return res;
    })();