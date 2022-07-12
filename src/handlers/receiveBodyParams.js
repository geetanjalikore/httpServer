const receiveBodyParams = (req, res, next) => {
  const dataBuffer = [];
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
    dataBuffer.push(chunk);
  });

  req.on('end', () => {
    req.bodyParams = data;
    req.dataBuffer = Buffer.concat(dataBuffer);
    next();
  });
};

module.exports = { receiveBodyParams };
