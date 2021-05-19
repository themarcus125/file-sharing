const Table = require('cli-table');

let FILE_DIRECTORIES = [];

const appendDirectoriesFromFileserver = (fileList) => {
  if (fileList?.length > 0) {
    const date = new Date()
    const normalizedFileList = fileList.map(item => ({ ...item, createdAt: date.toLocaleString() }))
    FILE_DIRECTORIES = [...FILE_DIRECTORIES, ...normalizedFileList]
  }
}

const getFileDirectories = () => {
  return FILE_DIRECTORIES;
}

const getFileDirectoriesBySource = (source) => {
  return FILE_DIRECTORIES?.[source]
}

const getFileDirectoriesTable = () => {
  const table = new Table({
    head: ['Source Host', 'Source Port', 'File', 'Size', 'Created At']
    , colWidths: [18, 18, 30, 18, 30]
  });
  FILE_DIRECTORIES?.forEach((item) => {
    const { host, port, name, size, createdAt } = item;
    table.push([host, port, name, `${size} B`, createdAt]);
  })
  return table.toString();
}

module.exports = {
  appendDirectoriesFromFileserver,
  getFileDirectories,
  getFileDirectoriesBySource,
  getFileDirectoriesTable,
}