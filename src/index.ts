
import * as codewars from './codewars/scrape';

export const scrape_katas = (req, res) => {
  if (req.method !== 'GET') res.status(500).json({ error: new Error('Supports only GET') });
  
  const { username } = req.query;
  
  if (!username) return res.status(500).json({ error: new Error('username is empty') });
  
  codewars.scrape_katas(username)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json({ error }));
};