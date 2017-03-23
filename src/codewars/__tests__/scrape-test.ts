import test from 'ava';
import * as scrape from '../scrape';


test('Codewars -> katas', async (t) => {
    const { scrape_katas } = scrape;
    const res = await scrape_katas('SiarheiMelnik');
    t.deepEqual(res, {
        solved: ["multiply"],
        total: 1,
        userName: 'SiarheiMelnik'
    });
});