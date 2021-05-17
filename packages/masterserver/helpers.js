const getServerDetails = (server, socket) => {
  console.log('---------server details -----------------');

  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port ' + port);
  console.log('Server ip : ' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);

  var lport = socket.localPort;
  var laddr = socket.localAddress;
  console.log('Server is listening at LOCAL port ' + lport);
  console.log('Server LOCAL ip : ' + laddr);
  return {port: port, address: ipaddr, family: family, localPost: lport, localIP: laddr}

}

const getClientInfo = (socket) => {
  console.log('------------remote client info --------------');

  var rport = socket.remotePort;
  var raddr = socket.remoteAddress;
  var rfamily = socket.remoteFamily;

  console.log('REMOTE Socket is listening at port ' + rport);
  console.log('REMOTE Socket ip : ' + raddr);
  console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);
  return {port: rport, address: raddr, family: rfamily}
}

const onClose = (e) => {
  console.log('Closed !');
  if (e) {
    console.log('Unexpected error happened, ', e);
  }
}

const onError = (e) => {
  console.log('Error: ' + e);
}

module.exports = {
  getServerDetails,
  getClientInfo,
  onClose,
  onError
}