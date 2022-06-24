const { createServer } = require('net');
const { parseRequest } = require('./src/parser.js');
const { Response } = require('./src/response.js');
const { requestHandler, serveFileContents, notFoundError } = require("./src/handlers.js");

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

const handlers = [requestHandler, serveFileContents, notFoundError];

const main = (path) => {
  const server = createServer((socket) => {
    onConnection(socket, createHandler(handlers), path);
  });

  const PORT = 8000;
  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
};

main(process.argv[2]);
