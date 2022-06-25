const { parseRequest } = require('./parser.js');
const { Response } = require('./response.js');
const { dynamicHandler } = require("./dynamicHandler.js");
const { serveFileContents } = require("./serveFileContents.js");

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
