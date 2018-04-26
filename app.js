const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use((req, res, next)=> {
  console.log(`${req.method} Request for ${req.url} :: Status code ${res.statusCode}`);
  next();
});

app.use(cors());

app.use(express.static("./public/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: "false"}));

app.post('/logs/bullettin/app', (req, res) => {

  console.log(`message from app : ${req.body.message}`);
  res.end('success');
});

app.get('/app/database/notes', (req, res) => {
  fs.createReadStream('./database/notes.txt').pipe(res);
});

app.post('/app/database/notes', (req, res) => {
  fs.appendFileSync('./database/notes.txt', req.body.note.trim() + "\n");

  res.writeHead(200, {"Content-Type" : "text/plain"});
  res.end("Note Saved");
});

app.delete('/app/database/notes', (req, res) => {

  fs.writeFileSync('./database/notes.txt', req.body.deleteReq.trim() + "\n");

  res.writeHead(200, {"Content-Type" : "text/plain"});
  res.end("Note Deleted");
});

app.get("*", (req, res) => {
  res.writeHead(404, {"Content-type" : "text/plain"});
  console.log(`${req.method} Request for ${req.url} :: Status code ${res.statusCode}`);
  res.end(`Cant Render page bud`);
});

app.listen(process.env.PORT || 8080, () => console.log('Success'));

console.log("Express server started on port 3000");

exports = app;
