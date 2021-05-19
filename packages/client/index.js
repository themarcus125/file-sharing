if (process.argv.length < 3) {
  console.log("Please choose an action in the list below:\n");
  console.log("1. list");
  console.log("   list all the file infos from master server\n");
  console.log("2. download <host> <port> <filename> [dest_folder] [timeout]");
  console.log("   download a file from file server\n");
  console.log("   - host: required, file server host");
  console.log("   - port: required, file server port");
  console.log(
    "   - filename: required, name of file which you want to download"
  );
  console.log("   - dest_folder: optional, default: downloads");
  console.log("   - timeout: optional, default: 300000 (ms) == 5 (m)");
  process.exit(0);
}

const { EVENTS, CLIENT } = require("../../constants");
const Env = require("../common/env");
const FileServerCli = require("../common/fileserver-cli");
const MasterServerCli = require("../common/masterserver-cli");

const action = process.argv[2];
switch (action) {
  case CLIENT.ACTIONS.LIST:
    list();
    break;
  case CLIENT.ACTIONS.DOWNLOAD:
    download();
}

function list() {
  const onDataCallback = (data) => {
    if (data) {
      const { event, payload: retrievedData } = JSON.parse(data);
      if (event === EVENTS.RETRIEVE_FILE_DIRECTORIES) {
        console.log(retrievedData)
      }
    }
  }
  const config = Env.extractMasterServerConfig();
  const mcli = new MasterServerCli(config.host, config.port, false, onDataCallback);
  mcli.requestFileInfos();
}

function download() {
  if (process.argv.length < 6) {
    console.log("invalid arguments");
    process.exit(0);
  }

  function checkArgv(value, message) {
    if (!value) {
      console.log(message);
      process.exit(0);
    }
  }

  const [_1, _2, _3, host, port, filename, destFolder, timeout] = process.argv;
  checkArgv(host, "host is missing");
  checkArgv(port, "port is missing");
  checkArgv(filename, "filename is missing");

  let lastPercent = 0;
  function listener(event, payload) {
    switch (event) {
      case EVENTS.FILE_CHUNK:
        if (lastPercent < payload.percent) {
          lastPercent = payload.percent;
          console.clear();
          console.log(payload.percent + '%');
        }
        break;
      case EVENTS.FILE_EOF:
        console.log(`download file "${payload.filename}" is completed`);
        process.exit(0);
      default:
        process.exit(0);
    }
  }

  const fcli = new FileServerCli(host, Number(port), listener);

  fcli.download(
    filename,
    `${destFolder || CLIENT.DEFAULT_DOWNLOAD_FOLDER}/${filename}`
  );

  setTimeout(() => {
    process.exit(0);
  }, timeout || CLIENT.DEFAULT_TIMEOUT);
}
