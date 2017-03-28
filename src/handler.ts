
import * as P from 'bluebird';
import * as codewars from './codewars/scrape';

export const scrape_katas = (req, res) => {
  return P.resolve()
    .then(() => {
      if (req.method !== 'POST') {
        const error = new Error('Only POST requests are accepted');
        throw error;
      }

      const { username } = req.body;

      console.log(username);

      if (!username) {
        const error = new Error('username is empty');
        throw error;
      }

      return codewars.scrape_katas(username)
    })
    .then(data => res.json({ data }))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
      return P.reject(err);
    });
};