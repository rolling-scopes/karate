
import test from 'ava';
import * as scrape from '../scrape';

const { scrape_profile } = scrape;

test('Duolingo -> profile', async (t) => {
  const res = await scrape_profile('siarheimel');
  t.true(res);
});
