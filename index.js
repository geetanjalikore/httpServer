const { createServer } = require('net');
const { connectToServer } = require('./src/handlers.js');

const main = (path) => {
  const server = createServer((socket) => {
    connectToServer(socket, path);
  });

  const PORT = 8000;
  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
};

main(process.argv[2]);
