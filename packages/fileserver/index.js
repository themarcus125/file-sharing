if (!process.env.F_HOST) {
  console.error("env.F_HOST is missing");
  process.exit(-1);
}

if (!process.env.F_PORT) {
  console.error("env.F_PORT is missing");
  process.exit(-1);
}

const MasterServerCli = require('../common/masterserver-cli');
const UdpServer = require('./udp-server');
const FileManager = require('./file-manager');
const Env = require('../common/env');

const config = {
  masterServer: Env.extractMasterServerConfig(),
  fileServer: {
    host: process.env.F_HOST,
    port: process.env.F_PORT
  }
};

async function startFileServer() {
  if (process.env.NODE_ENV !== 'test') {
    const fileInfos = await FileManager.getFileInfos();
    const mcli = new MasterServerCli(config.masterServer.host, config.masterServer.port);
    mcli.sendFileInfos(fileInfos.map(info => ({
      ...info,
      host: config.fileServer.host,
      port: config.fileServer.port
    })));
  }
  
  const server = new UdpServer(config.fileServer.host, config.fileServer.port);
  server.bind();
}

startFileServer();