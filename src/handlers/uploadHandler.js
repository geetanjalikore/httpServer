const fs = require('fs');
const { parseParams } = require('./parseParams');

const getBoundary = (headers) => {
  const contentType = headers['content-type'];
  const [, boundaryString] = contentType.split('; ');
  const [, boundary] = boundaryString.split('=');
  return boundary;
};

const uploadHandler = (uploadPath) => (req, res, next) => {
  const { pathname } = req.url;

  if (pathname === '/upload' && req.method === 'POST') {
    const boundaryStr = getBoundary(req.headers);
    const boundary = new Buffer.from(boundaryStr, 'utf8');

    const params = parseParams(req.dataBuffer, boundary);
    const files = params.filter(param => param.headers.filename);

    files.forEach(({ headers, content }) => {
      console.log([content.toString()]);
      fs.writeFileSync(`${uploadPath}/${headers.filename}`, content);
    });

    return;
  }
  next();
};

module.exports = { uploadHandler };
