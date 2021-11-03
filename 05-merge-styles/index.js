const fs = require('fs')
const path = require('path')
const outputDir = 'project-dist'
const outputFile = 'bundle.css'
const outputPath = path.resolve(__dirname, outputDir, outputFile)
const stylesDir = 'styles'
const stylesPath = path.resolve(__dirname, stylesDir)

async function createBundle() {
    const outputStream = fs.createWriteStream(outputPath);
    const files = await fs.promises.readdir(stylesPath)
    for (const file of files) {
        if (path.extname(file) !== '.css') continue
        let stream = fs.createReadStream(path.resolve(stylesPath, file))
        stream.pipe(outputStream);
    }
}

createBundle()
