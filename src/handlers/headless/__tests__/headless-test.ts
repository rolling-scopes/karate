
import test from 'ava';
import { test_cdp } from '../headless';

test('Duolingo -> profile', async (t) => {
  const res = await test_cdp('https://medium.com', `document.querySelector('.u-letterSpacingTight').innerText`);
  t.is(res, 1);
});
