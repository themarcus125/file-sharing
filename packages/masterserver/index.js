// const express = require("express");
// const http = require("http");
// const socketio = require("socket.io");
// const { SERVICES } = require("../../constants")
// const PORT = process.env.PORT || 5000;

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// const onAppendFileDirectories = (fileList, source) => {
//   console.log(fileList, source)
// }

// const onRetrieveFileDirectories = (fileList, source) => {
//   console.log(fileList, source)
// }

// io.on("connection", (socket) => {
//   console.log("A client is connected");
//   socket.on(SERVICES.APPEND_FILE_DIRECTORIES, onAppendFileDirectories);
//   socket.on(SERVICES.RETRIEVE_FILE_DIRECTORIES, onRetrieveFileDirectories);
// })

// server.listen(PORT, () => {
//   console.log(`server running at port ${PORT}`);
// });


const net = require('net');
const { SERVICES, MASTERSERVER_PORT } = require('../../constants')
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

  getServerDetails(server, socket);

  getClientInfo(socket);

  console.log('--------------------------------------------')
  //var no_of_connections =  server.getConnections(); // sychronous version
  server.getConnections(function (error, count) {
    console.log('Number of concurrent connections to the server : ' + count);
  });

  socket.setEncoding('utf8');

  socket.setTimeout(800000, function () {
    console.log('Socket timed out');
  });

  socket.on('data', (data) => {
    const [service, retrievedData] = data.split('----');
    switch (service) {
      case SERVICES.APPEND_FILE_DIRECTORIES:
        console.log('Append ', JSON.parse(retrievedData))
        break;
      default:
        console.log(retrievedData);
        break;
    }
  })

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
