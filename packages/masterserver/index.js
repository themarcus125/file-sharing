const net = require('net');
const { EVENTS, MASTERSERVER_PORT } = require('../../constants');
const { appendDirectoriesFromFileserver, getFileDirectoriesTable, getFileDirectories } = require('./files');
const { getServerDetails, getClientInfo, onClose, onError } = require('./helpers')

const MAX_CONNECTION = 10;
const SERVER_TIMEOUT = 5000000;
const SOCKET_TIMEOUT = 1200000;
// creates the server
const server = net.createServer();

//emitted when server closes ...not emitted until all connections closes.
server.on('close', onClose);

// emitted when new client connects
server.on('connection', function (socket) {
  const { port: clientPort } = getClientInfo(socket);
  //var no_of_connections =  server.getConnections(); // sychronous version
  server.getConnections(function (error, count) {
    console.log('Number of concurrent connections to the server : ' + count);
  });
  socket.setEncoding('utf8');
  socket.setTimeout(800000, function () {
    console.log('Socket timed out');
  });
  socket.on('drain',function(){
    console.log('write buffer is empty now .. u can resume the writable stream');
    socket.resume();
  });
  socket.on('error', function (error) {
    console.log('Error : ' + error);
  });
  socket.on('timeout', function () {
    console.log('Socket timed out !');
    socket.end('Timed out!');
    // can call socket.destroy() here too.
  });
  socket.on('end', function (data) {
    console.log('Socket ended from other end!');
    console.log('End data : ' + data);
  });
  socket.on('close', onClose);
  socket.on('data', (data) => {
    const {event, payload: retrievedData} = JSON.parse(data);
    let fileDirectoriesTable = ''
    switch (event) {
      case EVENTS.APPEND_FILE_DIRECTORIES:
        console.log('Appending Directories from File Server');
        appendDirectoriesFromFileserver(retrievedData);
        break;
      case EVENTS.REQUEST_RETRIEVE_FILE_DIRECTORIES:
        console.log('Resolving Directories retrieve request from Client with port ', clientPort);
        fileDirectoriesTable = getFileDirectoriesTable();
        socket.write(JSON.stringify({
          event: EVENTS.RETRIEVE_FILE_DIRECTORIES,
          payload: fileDirectoriesTable
        }));
        break;
      default:
        console.log(retrievedData);
        break;
    }
  })
  setTimeout(function () {
    var isdestroyed = socket.destroyed;
    console.log('Socket destroyed:' + isdestroyed);
    socket.destroy();
  }, SOCKET_TIMEOUT);

});

// emits when any error occurs -> calls closed event immediately after this.
server.on('error', onError);
//emits when server is bound with server.listen
server.on('listening', function () {
  console.log('Server is listening!');
});
server.maxConnections = MAX_CONNECTION;
//static port allocation
server.listen(MASTERSERVER_PORT);
setTimeout(function () {
  server.close();
}, SERVER_TIMEOUT);
