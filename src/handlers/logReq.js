const logReq = ({ url, method }, res, next) => {
  console.log(method, url.pathname);
  next();
};

module.exports = { logReq };
