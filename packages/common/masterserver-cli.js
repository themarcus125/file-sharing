const net = require('net');
const Logger = require('./logger');
const { EVENTS } = require('../../constants');

class MasterServerCli {
  constructor(host, port, logging = true, onDataCallback = () => {}) {
    this.logger = new Logger(`${MasterServerCli.name}_${host}:${port}`)
    this.logger.info(`${host}, ${port}`)
    this.client = net.connect({ host, port}, () => {
      logging && this.logger.info("connect to master server success");
    });
    this.client.setEncoding('utf8');
    this.client.on('end', () => {
      logging && this.logger.info("disconnected from server");
    });
    this.client.on('data', (data) => {
      onDataCallback(data)
    })
  }

  sendFileInfos(fileInfos) {
    this.client.write(JSON.stringify({
      event: EVENTS.APPEND_FILE_DIRECTORIES,
      payload: fileInfos
    }));
  }

  requestFileInfos() {
    this.client.write(JSON.stringify({
      event: EVENTS.REQUEST_RETRIEVE_FILE_DIRECTORIES,
      payload: '',
    }));
  }
}

module.exports = MasterServerCli;