const database = require('../database');

module.exports = {

    home(req, res) {

        res.render('home', {
            title: "ElCentino's Bullettin App"
        });
    },

    logToServer(req, res) {

        console.log(`message from app : ${req.body.message}`);
        res.end('success');
    },

    getNotes(req, res) {

        database.query("SELECT * FROM notes", result => {

            res.json(result);
        });
    },

    createNote(req, res) {

        database.query(`INSERT INTO notes(id, note) VALUES('${req.body.noteId}', '${req.body.note}')`, response => {

            res.end("Unsaved Note Added");
        });
    },

    updateNote(req, res) {

        database.query(`UPDATE notes SET note = '${req.body.note}' WHERE id='${req.params.noteId}'`, response => {

            res.end("Note Saved");
        });
    },

    deleteNote(req, res) {

        database.query(`DELETE FROM notes WHERE id='${req.params.noteId}'`, response => {

            res.end("Note Deleted");
        });
    }
}