const mongoose = require('mongoose')
require('dotenv').config()

mongoose.Promise = global.Promise;

module.exports.connect = () => {

  return new Promise((resolve, reject) => {

    mongoose.connect(process.env.ENVIRON === 'testing' ? `${process.env.NOSQLDB}/${process.env.DB_TEST}` : `${process.env.NOSQLDB}/${process.env.DB_NOTES}`);
    mongoose.connection
      .once('open', () => resolve('Connected to MongoDB'))
      .on('error', error => reject('Error : ' + error));

  });
}
