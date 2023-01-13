const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  next(error);
};

// eslint-disable-next-line consistent-return
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // eslint-disable-next-line no-param-reassign
    request.token = authorization.substring(7);
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const { token } = request;

  let decodedToken = null;
  if (token) {
    decodedToken = jwt.verify(token, process.env.SECRET);
  }

  let user = null;
  if (decodedToken && decodedToken.id) {
    user = await User.findById(decodedToken.id);
    // eslint-disable-next-line no-param-reassign
    request.user = user;
  }

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
