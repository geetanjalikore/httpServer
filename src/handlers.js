const fs = require('fs');
const { parseRequest } = require('./parser.js');
const { Response } = require('./response.js');

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

const sumHandler = (uri, response) => {
  let numbers = uri.split('/').filter(num => isFinite(num));
  numbers = numbers.map(num => +num);
  response.send(`Sum of numbers : ${sum(numbers)}`);
  return true;
}

const dynamicHandler = (response, { uri }) => {
  if (uri === '/') {
    response.send('Welcome');
    return true;
  }

  if (uri.match(/\d+\/\d+/)) {
    return sumHandler(uri, response);
  }
  return false;
};

const getExtension = (fileName) => fileName.split('.').slice(-1)[0];

const pageHandler = (fileName, response) => {
  if (fs.existsSync(fileName)) {
    const extension = getExtension(fileName);
    const contentType = contentTypes[extension];
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', contentType);
    response.send(content);
    return true;
  }
  return false;
}

const serveFileContents = (response, request, path) => {
  let { uri } = request;
  if (uri === '/') {
    uri = '/all.html';
  }
  const fileName = path + uri;
  return pageHandler(fileName, response);
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

const createHandler = (handlers) => {
  return (response, request, path) => {
    for (const handler of handlers) {
      if (handler(response, request, path)) {
        return true;
      }
    }
  }
};

const onConnection = (socket, handle, path) => {
  socket.on('data', (chunk) => {
    const request = parseRequest(chunk.toString());
    const response = new Response(socket);
    handle(response, request, path);
  });
};

const handlers = [countHandler(), serveFileContents, dynamicHandler, notFoundError];

const connectToServer = (socket, path) =>
  onConnection(socket, createHandler(handlers), path);

module.exports = { connectToServer }
