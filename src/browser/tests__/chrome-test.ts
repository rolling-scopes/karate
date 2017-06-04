
import test from 'ava';
import chrome from '../chrome';

test('Chrome', async (t) => {
  await chrome();
  t.is(2, 2);
});
