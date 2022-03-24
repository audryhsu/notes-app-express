/*
practice application for using mongoose
Note: had to run node mongo.js from windows shell, as i was getting a MongooseServerSelectionError from running in Ubuntu WSL.
*/

const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('please provide the password as an argument: node mongo.js <password>');
//   process.exit(1)
// }
//
// const password = process.argv[2]
const password = '1h2uTYK0vR1z2f32'

// named new databse 'noteApp', Atlas auto creates if doesnt' exist already
const url = `mongodb+srv://audryhsu:${password}@fso-cluster.xetr7.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

// define schema for a note
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// create a Note model
// mongoose models have methods to save objects to the database
const Note = mongoose.model('Note', noteSchema)

// create a new note object based on Note model
const note = new Note({
  content: "Chocolate is silky",
  date: new Date(),
  important: true,
})
// invoked save method on the note
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}).catch(err => {console.log(err);})

// invoke find method of Note model to retrieve objects from db
// we can pass in search parameters as an object into the find method to query documents

Note.find({important:false }).then(result => {
  if (!result.length) console.log('no results');
  else {
    result.forEach((note) => {
      console.log(note);
    });

  }
  mongoose.connection.close()
})
