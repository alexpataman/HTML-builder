const fs = require('fs');
const { Transform } = require('stream');
const path = require('path');

const outputDir = 'project-dist';
const outputCssFile = 'style.css';
const outputHTMLFile = 'index.html';
const stylesInputDir = 'styles';
const templateFile = 'template.html';
const componentsDir = 'components';
const assetsDir = 'assets';

async function createOutputDir() {
  let outputDirPath = path.resolve(__dirname, outputDir);
  await fs.promises.rm(outputDirPath, { recursive: true, force: true });
  await fs.promises.mkdir(outputDirPath, { recursive: true });
}

async function createStylesBundle() {
  const outputStream = fs.createWriteStream(
    path.resolve(__dirname, outputDir, outputCssFile)
  );
  const stylesPath = path.resolve(__dirname, stylesInputDir);
  const files = await fs.promises.readdir(stylesPath);
  for (const file of files) {
    if (path.extname(file) !== '.css') continue;
    let stream = fs.createReadStream(path.resolve(stylesPath, file));
    stream.pipe(outputStream);
  }
}

async function getFileData(file) {
  let stream = fs.createReadStream(file);
  stream.setEncoding('utf8');
  let data = '';
  for await (const chunk of stream) {
    data += chunk;
  }
  return data;
}

async function generateHtml() {
  let outputStream = fs.createWriteStream(
    path.resolve(__dirname, outputDir, outputHTMLFile)
  );
  let stream = fs.createReadStream(path.resolve(__dirname, templateFile));
  const TransformTemplate = new Transform({
    transform(chunk) {
      const regexp = /{{(.*)}}/g;
      const replacement = [...chunk.toString().matchAll(regexp)];

      Promise.allSettled(
        replacement.reduce((acc, el) => {
          acc.push(
            (async (el) => {
              let html = await getFileData(
                path.resolve(__dirname, componentsDir, el[1] + '.html')
              );
              return { placeholder: el[0], html: html };
            })(el)
          );
          return acc;
        }, [])
      ).then((results) => {
        let html = chunk.toString();
        results.forEach((result) => {
          html = html.replaceAll(result.value.placeholder, result.value.html);
        });
        this.push(html);
      });
    },
  });

  stream.pipe(TransformTemplate).pipe(outputStream);
}

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

async function copyAssets() {
  await copyDir(
    path.resolve(__dirname, assetsDir),
    path.resolve(__dirname, outputDir, assetsDir)
  );
}

async function run() {
  await createOutputDir();
  createStylesBundle();
  generateHtml();
  copyAssets();
}

run();
