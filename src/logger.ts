
import * as winston from 'winston';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      handleExceptions: false,
      json: false,
      timestamp() { return new Date().toISOString().replace(/T/g, ' ') },
    }),
  ],
});

export default logger;
