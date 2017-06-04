
import test from 'ava';
import * as scrape from '../scrape';

test('Codewars -> katas', async (t) => {
  const res = await scrape.katas('SiarheiMelnik');
  console.log(res);
  t.is(1, 1);
});
