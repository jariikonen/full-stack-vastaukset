const fs = require('fs');

if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local', override: true }); // eslint-disable-line
} else {
  require('dotenv').config(); // eslint-disable-line
}

const logger = require('./logger');

const { NODE_ENV, PORT } = process.env;

logger.info(`running in ${NODE_ENV} environment`);

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV,
};
