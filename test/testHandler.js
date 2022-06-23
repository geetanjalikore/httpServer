const { requestHandler } = require('../src/server.js');
const assert = require('assert');

const mockSocket = () => ({
  content: '',
  write: function (data) { this.content = data }
});

describe('requestHandler', () => {
  it('should handle the request', () => {
    const mockedSocket = mockSocket();
    requestHandler(mockedSocket, { uri: '/' });

    assert.deepStrictEqual(
      mockedSocket.content,
      'HTTP/1.1 200 ok\r\n\r\nwelcome'
    );
  });

  it('should handle the request with /geets uri', () => {
    const mockedSocket = mockSocket();
    requestHandler(mockedSocket, { uri: '/geets' });

    assert.deepStrictEqual(
      mockedSocket.content,
      'HTTP/1.1 200 ok\r\n\r\nbye'
    );
  });
});