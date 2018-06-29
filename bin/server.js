const { app } = require('../app')
const http = require('http')

const server = http
  .createServer(app)
  .listen(process.env.PORT || 3000);

server
  .on('error', error => console.log(error))
  .on('listening', () => console.log('Express server started on port ' + server.address().port));
