const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const database = require('./database');
const uuidv1 = require('uuid/v1');

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

  database.query("SELECT * FROM notes", result => {

      res.json(result);
  });
});

app.post('/app/database/notes', (req, res) => {
  
  database.query(`INSERT INTO notes(id, note) VALUES('${req.body.noteId}', '${req.body.note}')`, response => {

    res.end("Unsaved Note Added");
  });
});

app.post('/app/database/notes/:noteId', (req, res) => {
  
    database.query(`UPDATE notes SET note = '${req.body.note}' WHERE id='${req.params.noteId}'`);
    res.end("Note Saved");
});

app.delete('/app/database/notes/:noteId', (req, res) => {

  database.query(`DELETE FROM notes WHERE id='${req.params.noteId}'`, response => {

    res.end("Note Deleted");
  });
});

app.get("*", (req, res) => {
  res.writeHead(404, {"Content-type" : "text/plain"});
  console.log(`${req.method} Request for ${req.url} :: Status code ${res.statusCode}`);
  res.end(`Cant Render page bud`);
});

app.listen(process.env.PORT || 3000, () => console.log('Success'));

console.log("Express server started on port 3000");

exports = app;
