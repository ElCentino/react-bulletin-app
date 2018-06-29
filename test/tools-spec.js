const mongoose = require('mongoose');
const { NotesStore } = require('../models/NoteStore');
const assert = require('assert');

let note;

beforeEach(done => {

  mongoose.connection.collections['notes'].drop(() => done());
});

describe('Creates an entry', () => {

  before(done => {

      note = new NotesStore({
        noteId: "12345",
        note: "This is a sample note"
      });

      note.save()
        .then(() => done());
  });

  it('Should add a new note to the database', () => {

    assert(!note.isNew);
  });
});
