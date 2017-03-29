import test from 'ava';
import * as scrape from '../scrape';

const { scrape_katas } = scrape;

test('Codewars -> katas', async (t) => {
    const res = await scrape_katas('SiarheiMelnik');
    t.deepEqual(res, {
        solved: ["multiply"],
        total: 1,
        userName: 'SiarheiMelnik'
    });
});

test('Codewars -> not katas', async (t) => {
    try {
        await scrape_katas('h1');
        t.fail();
    } catch(e) {
        t.pass();
    }
});
