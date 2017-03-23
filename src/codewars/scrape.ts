
import * as P from 'bluebird';
import * as Nightmare from 'nightmare';

const CODEWARS_URL = 'https://www.codewars.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
const VIEWPORT = {
    width: 1024,
    height: 1024
};
const solvedKataSelector = '.list-item.kata .item-title a';
const totalKatasSelector = '.has-tip.tip-right.is-active a';

const nightmare = Nightmare();

export interface KatasScore {
    userName: string,
    solved: Array<string>,
    total: Number 
}

const grabKatas = (userName: string, solvedKataSelector: string, totalKatasSelector: string): KatasScore => ({
    userName,
    solved: Array.from(
            document.querySelectorAll(solvedKataSelector)
        )
        .map((el: HTMLElement) => el.innerHTML)
        .map((text: string) => text.toLowerCase().trim()),
    total: +/\((.*?)\)/gi.exec(document.querySelector(totalKatasSelector).innerHTML)[1],
});

export const scrape_katas = (userName: string) : Promise<KatasScore> =>
    P.coroutine(function * () {
        yield nightmare
            .useragent(USER_AGENT)
            .viewport(VIEWPORT.width, VIEWPORT.height)
            .goto(`${CODEWARS_URL}/users/${userName}/completed`)
            .wait('#shell_content')
            .scrollTo(0, 0);

        const isScroll = yield nightmare
            .evaluate(() => document.querySelectorAll('.js-infinite-marker').length === 1);

        if (isScroll) {
            let previousHeight;
            let currentHeight = 0;
            while (previousHeight !== currentHeight) {
                previousHeight = currentHeight;
                currentHeight = yield nightmare
                    .evaluate(() => document.body.scrollHeight);
                yield nightmare
                    .scrollTo(currentHeight, 0)
                    .wait(6000);
            }
        }
        return yield nightmare
            .evaluate(grabKatas, userName, solvedKataSelector, totalKatasSelector)
            .end();
    })();