const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log(`connecting to mongoDB...`);

mongoose.connect(url)
  .then(result => {
    console.log("connected to MongoDB");
  })
  .catch(err => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean,
})

// define a 'toJSON' method to transform mongo default id field from an object to a string and remove __v field
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//public interface of module is Note model
module.exports =  mongoose.model('Note', noteSchema)
