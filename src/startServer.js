const { server } = require('./server.js');

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});