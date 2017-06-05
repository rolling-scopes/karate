
import test from 'ava';
import * as scrape from '../scrape';

test('Duolingo -> profile', async (t) => {
  const res = await scrape.profile('siarheimel');
  t.deepEqual(res, {
    userName: 'siarheimel',
    languages: [
      {
        name: 'English - Level 5',
        nextLevel: 'Next level: 40 XP',
        total: 'Total XP: 410 XP',
      },
    ],
  });
});
