const fs = require('fs')
const path = require('path')
const copyPostfix = '-copy'
const inputDirName = 'files'

async function copyDir(inputDirPath, outputDirPath) {
    await fs.promises.mkdir(outputDirPath, { recursive: true })
    const files = await fs.promises.readdir(inputDirPath)
    for (const file of files) {
        fs.promises.copyFile(path.join(inputDirPath, file), path.join(outputDirPath, file))
    }

}

copyDir(path.resolve(__dirname, inputDirName), path.resolve(__dirname, inputDirName + copyPostfix))