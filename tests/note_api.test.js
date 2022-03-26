const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

// 'superagent' object used for making HTTP requests to the backend
const api = supertest(app)
const Note = require('../models/note')

// clear database and create two Notes before every test unit
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes.map(note => new Note(note))
  const promises = noteObjects.map(note => note.save())

  await Promise.all(promises)

  // alternative using mongoose method:
  // await Note.insertMany(helper.initialNotes)
})

/*
use supertest methods to make HTTP req to API and expect specific response status code and content-type headers
manually set timeout to be longer than the default jest timeout
*/

describe('when initial notes stored in database', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  // tests that inpsect the HTTP response body
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain('HTML is easy')
  })

})

describe('when adding a new note', function () {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies async calls',
      important: true,
    }
    await api.post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).toContain(
      'async/await simplifies async calls'
    )
  })

  test('note without content is not added', async () => {
    const invalidNote = {
      content: '',
      important: true,
    }

    await api.post('/api/notes')
      .send(invalidNote)
      .expect(400)

    // still need to check state of the db after failed operation
    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })

})

describe('when viewing a specific note', function () {

  test('succeed if valid id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // JSON serialize to be able to compare JS note object and stringified note from response body
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test.only('returns 404 if note no longer exists', async () => {
    const removedNoteId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${removedNoteId}`)
      .expect(404)
  })

  test('return 400 if id is invalid', async () => {
    const invalidId = 123456

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })

})

describe('when deleting a note', function () {
  test('return 204 if valid id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete= notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()
    const contents = notesAtEnd.map(note => note.content)

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)

  })

})

afterAll(() => mongoose.connection.close())
