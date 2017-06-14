import { scrape } from '../../scraper';

export const scraper = async (evt, ctx) => {
  try {
    const res = await scrape(evt);
    return ctx.succeed(res);
  } catch (e) {
    return ctx.fail({ error: e.message });
  }
};
