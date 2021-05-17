const net = require('net');
const { SERVICES, MASTERSERVER_PORT } = require('../../constants')
const FILE_LIST = [
  {
    id: 0,
    path: 'hello.zip'
  }
]

const clients = net.connect({port: MASTERSERVER_PORT}, () => {
  // 'connect' listener
  console.log('Connected to server at PORT: ' + MASTERSERVER_PORT);
  clients.write(`${SERVICES.APPEND_FILE_DIRECTORIES}----${JSON.stringify(FILE_LIST)}`)
});

clients.on('data', () => {
  clients.write(JSON.stringify(FILE_LIST))
  // clients.end();
});

clients.on('end', () => {
  console.log('disconnected from server');
});