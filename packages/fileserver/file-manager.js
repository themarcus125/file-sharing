const fs = require('fs');
const path = require('path');

module.exports = class FileManager {
  constructor(port) {
    this.fileDirectory = `data/${port}`
  }
  async getFileInfos(folder = this.fileDirectory) {
    const filenames = await fs.promises.readdir(folder);
    const fileInfos = [];
    for (const filename of filenames) {
      const filePath = path.join(this.fileDirectory, filename);
      const stats = await fs.promises.stat(filePath);
      fileInfos.push({
        size: stats.size,
        name: filename
      })
    }
    return fileInfos;
  }

  async streamFile(filename, cb) {
    const filePath = path.join(this.fileDirectory, filename);
    const stat = await fs.promises.stat(filePath);
    const readable = fs.createReadStream(filePath, {encoding: 'utf8', highWaterMark: 2048 });
    
    let total = 0;
    for await (const chunk of readable) {
      total += chunk.length;
      await cb(chunk, Math.round(total / stat.size * 100));
    }
  }
}