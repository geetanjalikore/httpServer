const parseBodyParams = (req, res, next) => {
  const { bodyParams } = req;
  const params = {};
  for (const [field, value] of bodyParams.entries()) {
    params[field] = value;
  }
  req.bodyParams = params;
  next();
};

module.exports = { parseBodyParams };
