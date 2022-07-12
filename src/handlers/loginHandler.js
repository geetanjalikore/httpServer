function createSession(username) {
  const date = new Date();
  const id = date.getTime();
  const session = { id, username, date };
  return session;
}

const loginPage = `
<html>
    <head>
      <title>Login</title>
    </head>

    <body>
      <form action="/login" method="post">
        <div><label for="username">username : </label>
          <input type="text" name="username" id="username">
        </div><br/>
        <div><label for="password">Password : </label>
          <input type="password" name="password" id="password">
        </div><br/>
        <div><input type="submit" value="Login"></div>
      </form>
    </body>
</html>`;

const isRegistered = (loginUsername, loginPassword, users) => {
  return users.find(({ username, password }) => {
    return username === loginUsername && password === loginPassword;
  });
};

const loginHandler = (users, sessions) => {
  return (req, res, next) => {
    const { pathname } = req.url;

    if (pathname !== '/login') {
      if (!req.session) {
        res.statusCode = 401;
        res.end('Access Denied !!! Login to access the flower-catalog');
        return;
      }
      next();
      return;
    }

    if (req.method === 'GET' && !req.session) {
      res.setHeader('content-type', 'text/html');
      res.end(loginPage);
      return;
    }

    const { bodyParams: { username, password } } = req;
    if (!isRegistered(username, password, users)) {
      res.end('Please register your details');
      return;
    }

    const session = createSession(username, password);
    sessions[session.id] = session;

    res.setHeader('Set-Cookie', `id=${session.id}`);
    res.setHeader('Location', '/index.html');
    res.statusCode = 302;
    res.end();
  };
};

module.exports = { loginHandler };
