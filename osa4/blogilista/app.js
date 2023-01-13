const express = require('express');
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
} = require('./utils/middleware');

const app = express();

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then((result) => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

morgan.token('data', (request, response) => {
  if (Object.values(request.body).length > 0) {
    return JSON.stringify(request.body);
  }
  return ' ';
});

app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data',
  { skip: (req, res) => process.env.NODE_ENV === 'test' },
));

app.use('/api/login', loginRouter);
app.use('/api/blogs', tokenExtractor, blogsRouter);
app.use('/api/users', userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
