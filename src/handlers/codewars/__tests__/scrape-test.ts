
import test from 'ava';
import * as scrape from '../scrape';

const { scrape_katas } = scrape;

test('Codewars -> katas', async (t) => {
  const res = await scrape_katas('telukigor');
  t.true(res.solved.indexOf('multiply') !== -1);
});

test('Codewars -> not katas', async (t) => {
  try {
    await scrape_katas('h1');
    t.fail();
  } catch(e) {
    t.pass();
  }
});
