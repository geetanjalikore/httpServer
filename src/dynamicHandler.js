const sumHandler = (response, { params }) => {
  const { a, b } = params;
  response.send(`Sum of numbers is ${+a + +b}`);
  return true;
};

const subHandler = (response, { params }) => {
  const { a, b } = params;
  response.send(`Subtract of numbers is ${+a - +b}`);
  return true;
};

const handleRedirect = (response, request) => {
  response.statusCode = 301;
  response.setHeader('Location', '/gk');
  response.send('Redirected to gk');
  return true;
};

const absHandler = (response, { params }) => {
  const { num } = params;
  response.send(`Absolute of ${num} is ${Math.abs(+num)}`);
  return true;
};

const dynamicHandler = (response, request) => {
  let { uri, params } = request;
  if (uri === '/') {
    response.send('Welcome');
    return true;
  }

  if (uri === '/gk') {
    response.send('Welcome GK');
    return true;
  }

  if (uri === '/geets') {
    return handleRedirect(response, uri);
  }

  if (uri === '/abs') {
    return absHandler(request);
  }

  if (uri.match('/sum')) {
    return sumHandler(response, request);
  }

  if (uri === '/operation') {
    if (params.operation === 'sum') {
      return sumHandler(response, request);
    }
    return subHandler(response, request);
  }

  if (uri === '/colors') {
    response.send(`<body style="background-color:${params.color}">WELCOME</body>`);
    return true;
  }
  return false;
};

exports.dynamicHandler = dynamicHandler;
