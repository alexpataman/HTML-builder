const { resolve } = require('path')
const { createReadStream } = require('fs')
const { stdout } = process;

const fileName = 'text.txt'
const stream = createReadStream(resolve(__dirname, fileName))

stream.on('data', data => {
    stdout.write(data.toString())
})