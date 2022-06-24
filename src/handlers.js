const fs = require('fs');

const contentTypes = {
  jpeg: 'image/jpeg',
  html: 'text/html',
  txt: 'text/plain'
};

const sum = (numbers) => {
  return numbers.reduce((total, num) => {
    total += num;
    return total;
  }, 0);
};

const requestHandler = (response, { uri }) => {
  if (uri === '/geets') {
    response.send('Welcome Geets');
    return true;
  }

  if (uri.match(/\d+\/\d+/)) {
    let numbers = uri.split('/').filter(num => isFinite(num));
    numbers = numbers.map(num => +num);
    response.send(`Sum of numbers : ${sum(numbers)}`);
    return true;
  }
  return false;
};

const serveFileContents = (response, { uri }, path) => {
  if (uri === '/') {
    uri = '/index.html';
  }
  const fileName = path + uri;

  if (fs.existsSync(fileName)) {
    const extension = fileName.match(/\..*/);
    const contentType = contentTypes[extension];
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', contentType);
    response.send(content);
    return true;
  }
  return false;
};

const notFoundError = (response, request) => {
  response.statusCode = 404;
  response.send('Not found');
};

module.exports = { requestHandler, serveFileContents, notFoundError } 
