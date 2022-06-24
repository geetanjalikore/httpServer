const { createServer } = require('net');
const fs = require('fs');
const { parseRequest } = require('./parser.js');
const { Response } = require('./response.js');

const sum = (numbers) => {
  return numbers.reduce((total, num) => {
    total += num;
    return total;
  }, 0);
};

const requestHandler = (response, { uri }) => {
  if (uri === '/') {
    response.send('Welcome');
    return;
  }

  if (uri.match(/\d+\/\d+/)) {
    let numbers = uri.split('/').filter(num => isFinite(num));
    numbers = numbers.map(num => +num);
    response.send(`Sum of numbers : ${sum(numbers)}`);
    return;
  }
  response.statusCode = 404;
  response.send('not found');
};

const serveFileContents = (response, { uri }) => {
  if (uri === '/') {
    uri = '/index.html';
  }
  const fileName = './public/submarine' + uri;

  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.send(content);
    return;
  }

  response.statusCode = 404;
  response.send('file not found');
};

const onConnection = (socket, handler) => {
  socket.setEncoding('utf-8');
  socket.on('data', (chunk) => {
    const request = parseRequest(chunk);
    const response = new Response(socket);
    handler(response, request);
  });
};

const server = createServer((socket) => {
  onConnection(socket, requestHandler);
});

module.exports = { server, requestHandler }
