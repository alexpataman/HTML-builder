const fs = require('fs');
const path = require('path');
const folderName = 'secret-folder';
const folderPath = path.resolve(__dirname, folderName);

const getFiles = async function () {
  try {
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      let ext = path.extname(file);
      let basename = path.basename(file, ext);

      fs.stat(path.resolve(folderPath, file), (err, stats) => {
        if (!stats.isDirectory()) {
          process.stdout.write(
            `${basename} - ${ext.slice(1)} - ${stats.size / 1000}kb\n`
          );
        }
      });
    }
  } catch (err) {
    process.stdout.write(err);
  }
};

getFiles();
