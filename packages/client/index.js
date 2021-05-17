const net = require('net');
const { SERVICES, MASTERSERVER_PORT } = require('../../constants')

const client = net.connect({ port: MASTERSERVER_PORT }, () => {
  // 'connect' listener
  console.log('Connected to server at PORT: ' + MASTERSERVER_PORT);
  client.write(`${SERVICES.REQUEST_RETRIEVE_FILE_DIRECTORIES}----`)
});

client.setEncoding('utf8');

client.on('data', (data) => {
  const [service, retrievedData] = data.split('----');
  switch (service) {
    case SERVICES.RETRIEVE_FILE_DIRECTORIES:
      console.log("All files retrieved from Master server:")
      console.log(retrievedData)
      break;
    default:
      console.log(retrievedData);
      break;
  }
});

client.on('end', () => {
  console.log('disconnected from server');
});