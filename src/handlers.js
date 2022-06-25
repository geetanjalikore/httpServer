const fs = require('fs');

const contentTypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
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

const getExtension = (fileName) => fileName.split('.').slice(-1)[0];

const serveFileContents = (response, { uri }, path) => {
  if (uri === '/') {
    uri = '/all.html';
  }
  const fileName = path + uri;

  if (fs.existsSync(fileName)) {
    const extension = getExtension(fileName);
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

const countHandler = () => {
  let count = 0;
  return (response, { uri }) => {
    count++;
    if (uri === '/count') {
      response.send(`Number of hits : ${count}`);
      return true;
    }
    return false;
  }
};

module.exports = { requestHandler, serveFileContents, notFoundError, countHandler } 
