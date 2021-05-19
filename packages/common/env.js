const { MASTERSERVER_PORT } = require("../../constants");

class Env {
  static extractMasterServerConfig() {
    const config = {
      host: 'localhost',
      port: MASTERSERVER_PORT
    };

    if (!!process.env.M_HOST) {
      config.host = process.env.M_HOST;
    }
    
    if (!!process.env.M_PORT) {
      config.port = Number(process.env.M_PORT);
    }

    return config;
  }
}

module.exports = Env;