const fs = require('fs');
const path = require('path');

module.exports = class FileManager {
  static async getFileInfos(folder = 'data') {
    const filenames = await fs.promises.readdir(folder);
    const fileInfos = [];
    for (const filename of filenames) {
      const stats = await fs.promises.stat(filename);
      fileInfos.push({
        size: stats.size,
        name: filename
      })
    }
    return fileInfos;
  }

  static async streamFile(filename, cb) {
    const filePath = path.join('data', filename);
    const stat = await fs.promises.stat(filePath);
    const readable = fs.createReadStream(filePath, {encoding: 'utf8', highWaterMark: 2048 });
    
    let total = 0;
    for await (const chunk of readable) {
      total += chunk.length;
      await cb(chunk, Math.round(total / stat.size * 100));
    }
  }
}