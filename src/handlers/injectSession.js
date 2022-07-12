const injectSession = (sessions) => (req, res, next) => {
  req.session = sessions[req.cookies.id];
  next();
};

module.exports = { injectSession };
