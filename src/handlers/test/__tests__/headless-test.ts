
import test from 'ava';
import { test_cdp } from '../headless';

test('Duolingo -> profile', async (t) => {
  await test_cdp();
  t.is(1, 1);
});
