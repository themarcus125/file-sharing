class Logger {
  static Level = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    WARN: 'WARN'
  }

  constructor(ctx, logger = console) {
    this.ctx = ctx;
    this.logger = logger;
  }

  currentTime() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  }

  log(level, message) {
    this.logger.log(`[${level}][${this.currentTime()}][${this.ctx}] ${message}`);
  }

  info(message) {
    this.log(Logger.Level.INFO, message);
  }

  error(message) {
    this.log(Logger.Level.ERROR, message);
  }

  warn(message) {
    this.log(Logger.Level.WARN, message);
  }
}

module.exports = Logger;