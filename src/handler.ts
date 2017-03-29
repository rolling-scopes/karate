
import * as P from 'bluebird';
import * as codewars from './codewars/scrape';

export const scrape_katas = (req, res) => {
  return P.resolve()
    .then(() => {
      if (req.method !== 'POST') {
        return P.reject(new Error('Only POST requests are accepted'));
      }

      const { username } = req.body;

      console.log(username);

      if (!username) {
        return P.reject(new Error('username is empty'));
      }

      return codewars.scrape_katas(username)
    })
    .then(data => res.json({ data }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.message });
    });
};