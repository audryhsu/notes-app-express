/*
refactored, concise express application code
*/
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // takes care of try/except blocks
const app = express()
const cors = require('cors')

// import controllers that control specific application routes
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)
logger.info('connecting to mongoDB...')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(err => {
    logger.error(`error connecting to MongoDB: ${err.message}`)
  })


// MIDDLEWARE
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler) // must be last loaded


module.exports = app
