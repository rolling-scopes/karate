
import * as codewars from './codewars/scrape';

export const scrape_katas = (evt, ctx, cb) => {
  const { username } = JSON.parse(evt.body);
  
  if (!username) return cb(new Error('username is empty'));
  
  codewars.scrape_katas(username)
    .then(data => cb(null, { data }))
    .catch(error => cb(error));
};