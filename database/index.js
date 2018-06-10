const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "db4free.net",
    user: "century",
    password: "rock.roll",
    database: "reactapps"
});

conn.connect(err => {

    if(err) throw err;

    console.log("Connected to database");
});

module.exports.query = function(statement, callback) {

    conn.query(statement, (err, result, fields) => {

        if(err) throw err;

        if(callback) return callback(result, fields);
        
    });
};