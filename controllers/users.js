// controller for user routes
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// creates a new user
usersRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body

  const existingUser = await User.findOne( { username })
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  //hash user's password and hashed version in db
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    username,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const allUsers = await User
    .find({})
    .populate('notes', { content: 1, date: 1})

  res.json(allUsers)
})

module.exports = usersRouter
