const fs = require('fs');

const contentTypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
  html: 'text/html',
  txt: 'text/plain'
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
};

const serveFileContents = (response, request, path) => {
  let { uri } = request;
  if (uri === '/') {
    uri = '/all.html';
  }
  const fileName = path + uri;
  return pageHandler(fileName, response);
};

exports.serveFileContents = serveFileContents;
