const xhrLoginHandler = (req, res, next) => {
  const { pathname } = req.url;
  if (pathname === '/login') {
    res.end('Successfully logged in');
    return;
  }
  if (pathname === '/validate') {
    res.end(JSON.stringify(req.bodyParams));
    return;
  }
  next();
};

module.exports = { xhrLoginHandler };
