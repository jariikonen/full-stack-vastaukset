require('dotenv').config();
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
