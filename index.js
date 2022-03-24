require('dotenv').config() // import environment vars
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note');

// MIDDLEWARE
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  // returns array of note objects with toJSON automatically called by JSON.stringify
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  // use Mongoose's built-in method
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.statusMessage = 'Could not find note with id' + id
      response.status(404).end()
    }
  }).catch(err => next(err))
})

app.delete('/api/notes/:id', (request,response, next) => {
  const id = request.params.id

  Note.findByIdAndRemove(id).then(result => {
    console.log("Note deleted:", result);
    response.status(204).send(result)
  }).catch(err => {
    console.error(err);
    next(err)
  })
})


app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false, // set default value
    date: new Date(),
  })

  // save note to mongoDB instead of local filesystem
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  const {content, important} = request.body
  const note = {
    content,
    important,
  }

  // pass in id, new note data, and config object that tells mongoose to run data validations
  Note.findByIdAndUpdate(id, note, {
    new : true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedNote => {
      response.json(updatedNote)
  })
  .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, request, response, next) => {
  console.error(err.message);
  if (err.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (err.name === 'ValidationError') {
      return response.status(400).json({error: err.message})
  }
  next(error)
}

// error handler middleware must be last loaded
app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
