const { requestHandler } = require('../src/server.js');
const assert = require('assert');

const mockSocket = (statusLine) => ({
  statusLine: statusLine,
  content: '',
  send: function (data) { this.content = this.statusLine + data }
});

describe('requestHandler', () => {
  it('should handle the request', () => {
    const socket = mockSocket('HTTP/1.1 200 ok\r\n\r\n');
    requestHandler(socket, { uri: '/' });

    assert.deepStrictEqual(
      socket.content,
      'HTTP/1.1 200 ok\r\n\r\nWelcome'
    );
  });

  it('should handle the request with /geets uri', () => {
    const socket = mockSocket('HTTP/1.1 404 ok\r\n\r\n');
    requestHandler(socket, { uri: '/geets' });

    assert.deepStrictEqual(
      socket.content,
      'HTTP/1.1 404 ok\r\n\r\nnot found'
    );
  });

  it('should give the sum of numbers', () => {
    const socket = mockSocket('HTTP/1.1 200 ok\r\n\r\n');
    requestHandler(socket, { uri: '/1/2' });
    assert.deepStrictEqual(socket.content,
      'HTTP/1.1 200 ok\r\n\r\nSum of numbers : 3');
  });
});
