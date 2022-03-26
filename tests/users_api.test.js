const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
// 'superagent' object used for making HTTP requests to the backend
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in the db', function () {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })

    await user.save()
  })

  xtest('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart).toHaveLength(1)

    const newUser = {
      name: 'audry',
      username: 'audry123',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdUser = response.body

    expect(createdUser.passwordHash).not.toBeDefined()
    expect(createdUser.password).not.toBeDefined()

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(user => user.username)
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usernames).toContain(newUser.username)

  })

  test('returns 400 if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'blah',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})
