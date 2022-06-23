const { createServer } = require('net');
const { parseReqLine, parseHeader } = require('./parser.js');

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
    const lines = chunk.split('\r\n');
    const reqLine = parseReqLine(lines[0]);
    const reqHeaders = parseHeader(lines.slice(1));
    requestHandler(socket, { ...reqLine, reqHeaders });
    socket.end();
  });
});

module.exports = { server, requestHandler }
