const { EVENTS } = require("../../constants");

const udp = require("dgram");
const fs = require("fs");

class FileServerCli {
  constructor(host, port, listener = null) {
    this.host = host;
    this.port = port;
    this.listener = listener;
    this.fileLocation = {};
    this.client = udp.createSocket("udp4");
    this.client.on('message', data => {
      const {event, payload} = JSON.parse(data);

      let stream;
      switch (event) {
        case EVENTS.FILE_CHUNK:
          stream = this.fileLocation[payload.filename];
          stream.write(payload.chunk, 'utf8', error => {
            if (error) {
              console.log(`Error: write data to file ${payload.filename} failed, caused: ${error.message}`);
            }
          });
          break;
        case EVENTS.FILE_EOF: 
          stream = this.fileLocation[payload.filename];
          stream.close();
          break;
        case EVENTS.ERROR: 
          console.log("Error:", payload);
          break;
        default:
          console.log("Unknown event:", event, payload)  
      }

      this.listener && this.listener(event, payload);
    });

    this.on = this.client.on;
  }

  download(filename, destination) {
    this.fileLocation[filename] = fs.createWriteStream(destination);
    this.emit(EVENTS.DOWNLOAD_FILE, filename);
  }

  emit(event, payload = null) {
    this.send(
      JSON.stringify({
        event,
        payload,
      })
    );
  }

  send(message) {
    this.client.send(message, this.port, this.host);
  }
}

module.exports = FileServerCli;
