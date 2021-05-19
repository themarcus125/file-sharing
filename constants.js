const path = require('path');

const EVENTS = {
  APPEND_FILE_DIRECTORIES: 'append_file_directories',
  REQUEST_RETRIEVE_FILE_DIRECTORIES: 'request_retrieve_file_directories',
  RETRIEVE_FILE_DIRECTORIES: 'retrieve_file_directories',
  DOWNLOAD_FILE: 'download_file',
  FILE_CHUNK: 'file_chunk',
  FILE_EOF: 'file_oef',
  ERROR: 'error'
};

const MASTERSERVER_PORT = 5000;

const CLIENT = {
  ACTIONS: {
    LIST: 'list',
    DOWNLOAD: 'download'
  },
  DEFAULT_DOWNLOAD_FOLDER: path.resolve('downloads'),
  DEFAULT_TIMEOUT: 300000
}

module.exports = {
  MASTERSERVER_PORT,
  EVENTS,
  CLIENT
}