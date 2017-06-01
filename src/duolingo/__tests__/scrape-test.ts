
import test from 'ava';
import { scrape_profile } from '../scrape';

test('Duolingo -> profile', async (t) => {
  const res = await scrape_profile('siarheimel');
  t.is(res, { userName: 'siarheimel', languages:[
    {
      name: 'English - Level 5',
      nextLevel: 'Next level: 40 XP',
      total: 'Total XP: 410 XP',
    },
  ]});
});
