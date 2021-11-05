const fs = require('fs');
const path = require('path');
const copyPostfix = '-copy';
const inputDirName = 'files';

async function copyDir(inputDirPath, outputDirPath) {
  await fs.promises.rm(outputDirPath, { recursive: true, force: true });
  await fs.promises.mkdir(outputDirPath, { recursive: true });
  const files = await fs.promises.readdir(inputDirPath);
  for (const file of files) {
    fs.stat(path.resolve(inputDirPath, file), (err, stats) => {
      if (!stats.isDirectory()) {
        fs.promises.copyFile(
          path.join(inputDirPath, file),
          path.join(outputDirPath, file)
        );
      } else {
        copyDir(
          path.resolve(inputDirPath, file),
          path.resolve(outputDirPath, file)
        );
      }
    });
  }
}

copyDir(
  path.resolve(__dirname, inputDirName),
  path.resolve(__dirname, inputDirName + copyPostfix)
);
