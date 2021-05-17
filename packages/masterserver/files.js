const Table = require('cli-table');

const FILE_DIRECTORIES = {};

const appendDirectoriesFromFileserver = (fileList, source) => {
  if (FILE_DIRECTORIES?.[source]) {
    FILE_DIRECTORIES[source] = []
  }
  const date = new Date()
  const normalizedFileList = fileList.map(item => ({ ...item, createdAt: date.toLocaleDateString() }))
  FILE_DIRECTORIES[source] = [...normalizedFileList]
}

const getFileDirectories = () => {
  return FILE_DIRECTORIES;
}

const getFileDirectoriesBySource = (source) => {
  return FILE_DIRECTORIES?.[source]
}

const getFileDirectoriesTable = () => {
  const sources = Object.keys(FILE_DIRECTORIES)
  if (sources?.length > 0) {
    // instantiate
    var table = new Table({
      head: ['Source Port', 'Path', 'Size', 'Created At']
      , colWidths: [18, 30, 18, 30]
    });
    sources.forEach(source => {
      FILE_DIRECTORIES?.[source].forEach( item => {
        const { path = '', fileSize = '', createdAt = '' } = item
        table.push([source, path, `${fileSize} kB`, createdAt])
      })
    })
  }
  return table.toString()
}

module.exports = {
  appendDirectoriesFromFileserver,
  getFileDirectories,
  getFileDirectoriesBySource,
  getFileDirectoriesTable,
}