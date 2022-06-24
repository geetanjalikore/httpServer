const { createServer } = require('net');
const { parseRequest } = require('./parser.js');

const requestHandler = (socket, { uri }) => {
  const response = 'HTTP/1.1 200 ok\r\n\r\n';
  if (uri === '/') {
    socket.write(response + 'welcome');
    return;
  }
  socket.write(response + 'bye');
};

const server = createServer((socket) => {
  socket.setEncoding('utf-8');
  socket.on('data', (chunk) => {
    const request = parseRequest(chunk);
    requestHandler(socket, request);
    socket.end();
  });
});

module.exports = { server, requestHandler }
