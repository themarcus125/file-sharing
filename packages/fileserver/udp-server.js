const udp = require("dgram");
const Logger = require("../common/logger");
const FileManager = require("./file-manager");
const { EVENTS } = require("../../constants");

class UdpServer {
  constructor(host, port, fm) {
    this.host = host;
    this.port = port;
    this.fm = fm;
    this.logger = new Logger(`${UdpServer.name}_${host}:${port}`);
    this.server = udp.createSocket("udp4");
    this.server.on("listening", this.handleListening.bind(this));
    this.server.on("message", this.handleMessage.bind(this));
    this.server.on("error", this.handleError.bind(this));
    this.server.on("close", this.handleClose.bind(this));
  }

  bind() {
    this.server.bind(this.port, this.host);
  }

  handleListening() {
    const { address, port } = this.server.address();
    this.logger.info(`server is listening at: ${address}:${port}`);
  }

  handleError(error) {
    this.logger.error("an error occured: " + error);
    this.server.close();
  }

  async handleMessage(message, info) {
    const {event, payload: filename } = JSON.parse(message.toString());
    switch (event) {
      case EVENTS.DOWNLOAD_FILE:
        this.logger.info(
          `got request download file "${filename}" from ${info.address}:${info.port}`
        );
        try {
          await this.fm.streamFile(filename, (chunk, percent) => {
            this.emit(info, EVENTS.FILE_CHUNK, { filename, chunk, percent });
          });
          this.emit(info, EVENTS.FILE_EOF, { filename });
        } catch (err) {
          this.logger.error(`stream file "${filename}" failed, caused: ${err.message}`);
          this.emit(info, EVENTS.ERROR, err.message);
        }
        break;
      default:
        this.emit(info, EVENTS.ERROR, "no service matched");
    }
  }

  handleClose() {
    this.logger.info("server is closed");
  }

  emit(info, event, payload = null) {
    this.sendMessage(info, JSON.stringify({ event, payload }));
  }

  sendMessage({ port, address }, message) {
    this.server.send(message, port, address, (error) => {
      if (error) {
        this.logger.error(
          `send message to client at ${address}:${port} failed, caused: ${error.message}`
        );
      }
    });
  }

  close() {
    this.server.close();
  }
}

module.exports = UdpServer;
