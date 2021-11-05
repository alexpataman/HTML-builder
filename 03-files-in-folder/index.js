const fs = require('fs');
const path = require('path');
const folderName = 'secret-folder';
const folder = path.resolve(__dirname, folderName);

const getFiles = async function () {
  try {
    const result = [];
    const files = await fs.promises.readdir(folder);
    for (const file of files) {
      let ext = path.extname(file);
      let basename = path.basename(file, ext);

      fs.stat(path.resolve(folder, file), (err, stats) => {
        if (!stats.isDirectory()) {
          console.log(`${basename} - ${ext.slice(1)} - ${stats.size / 1000}kb`);
        }
      });
    }
    return result;
  } catch (err) {
    console.error(err);
  }
};

getFiles();
