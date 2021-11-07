const path = require('path');
const fs = require('fs');
const os = require('os');
const { stdin, stdout } = process;

const fileName = 'input.txt';
const filePath = path.resolve(__dirname, fileName);

fs.writeFile(filePath, '', () => {
  stdout.write(
    `Hello!${os.EOL}Type something below [Ctrl+C or type "exit" to finish]${os.EOL}`
  );
  stdin.on('data', (data) => {
    let str = data.toString();
    if (str.trim() === 'exit') {
      process.exit();
    }
    fs.appendFile(filePath, str, () => {});
  });

  process.on('SIGINT', process.exit);
  process.on('exit', () => {
    stdout.write(`${os.EOL}Thank you! Bye Bye!${os.EOL}`);
    process.exit();
  });
});
