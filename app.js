const express = require('express')
const http = require('http');
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const createError = require('http-errors')
const database = require('./database')
const uuidv1 = require('uuid/v1')
const { connect } = require('./models/connection')

let NoteStore;

connect()
  .then(result => {
    console.log(result);

      NoteStore  = require('./models/NoteStore');
  })
  .catch((reason) => console.log(reason));

const app = express();

app.use(cors());

app.use(express.static("./public/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: "false"}));

app.post('/logs/bullettin/app', (req, res) => {

  console.log(`message from app : ${req.body.message}`);
  res.end('success');
});

app.get('/app/database/notes', (req, res) => {

  if(process.env.DATABASE !== 'NOSQL') {

    database.query("SELECT * FROM notes", result => {

        res.json(result);
    });
  } else {

    NoteStore.find({}, (err, notes) => {

      if(err) throw err;

      res.json(notes);
    });
  }
});

app.post('/app/database/notes', (req, res) => {

  if(process.env.DATABASE !== 'NOSQL') {

    database.query(`INSERT INTO notes(id, note) VALUES('${req.body.noteId}', '${req.body.note}')`, response => {

      res.end("Unsaved Note Added");
    })
  } else {

    const { noteId : id, note: notes } = req.body

    const note = new NoteStore({
      id, note: notes
    });

    note.save()
      .then(() => res.end("Unsaved Note Added"));
  }
});

app.post('/app/database/notes/:noteId', (req, res) => {

  if(process.env.DATABASE !== 'NOSQL') {

    database.query(`UPDATE notes SET note = '${req.body.note}' WHERE id='${req.params.noteId}'`);
    res.end("Note Saved");
  } else {

    console.log(req.params.noteId)

    NoteStore.findOne({id: req.params.noteId}, (err, note) => {

      if(err) console.log('No Notes found');

      if(!note) {
        console.log('No Notes found');
        return;
      }

      note.id = req.params.noteId;
      note.note = req.body.note;
      note.save()
        .then(() => res.end("Note Saved"));
    });
  }


});

app.delete('/app/database/notes/:noteId', (req, res) => {

  if(process.env.DATABASE !== 'NOSQL') {

    database.query(`DELETE FROM notes WHERE id='${req.params.noteId}'`, response => {

      res.end("Note Deleted");
    });
  } else {

    NoteStore.remove({ id: req.params.noteId })
      .exec()
      .then(() => res.end('Note Deleted'));
  }
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  console.log("error " + err.message);
  res.status(err.status || 500).send("Something went wrong");
});

module.exports.app = app;
