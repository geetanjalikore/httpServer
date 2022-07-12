const { startServer } = require('server');
const { app } = require('./src/app.js');

const main = (port) => startServer(port, app('./public', './files'));

main(80);
