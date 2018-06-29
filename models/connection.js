const mongoose = require('mongoose')
require('dotenv').config()

mongoose.Promise = global.Promise;

module.exports.connect = callback => {

  mongoose.connect(process.env.ENVIRON === 'testing' ? `${process.env.NOSQLDB}/${process.env.DB_TEST}` : `${process.env.NOSQLDB}/${process.env.DB_NOTES}`);
  mongoose.connection
    .once('open', () => console.log('Connected to MongoDB'))
    .on('error', error => console.error('Error : ' + error));

  callback();
}
