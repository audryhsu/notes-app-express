/*
custom middleware functions go here
*/

const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, request, response, next) => {
  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return response.status(400).json({ error: err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (err.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })

  }
  logger.error(err.message)

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
