import { scrape } from '../../scraper';

export const scraper = async (evt, ctx, cb) => {
  try {
    const res = await scrape(evt);
    return cb(null, { body: JSON.stringify(res) });
  } catch (e) {
    return cb(null, { body: JSON.stringify({ error: e.message }) });
  }
};
