const mongoose = require('mongoose')
require('dotenv').config()

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  id : { type: String, required: true },
  note: { type: String, required: true}
});

module.exports = NoteStore = mongoose.model('Notes', NoteSchema);
