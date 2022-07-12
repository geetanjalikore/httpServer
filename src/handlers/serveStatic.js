const fs = require('fs');
const mime = require('mime-types');

const invalidReqMethod = (req, res) => {
  res.statusCode = 405;
  res.end('Invalid request method');
  return true;
};

const getFileName = ({ url }, path) => {
  const { pathname } = url;
  if (pathname === '/') {
    return path + '/index.html';
  }
  return path + pathname;
};

const serveStatic = (path) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return invalidReqMethod(req, res);
    }

    const fileName = getFileName(req, path);
    try {
      const content = fs.readFileSync(fileName);
      res.setHeader('content-type', mime.lookup(fileName));
      res.setHeader('content-length', content.length);
      res.end(content);
    } catch (error) {
      next();
    }
  };
};

module.exports = { serveStatic };
