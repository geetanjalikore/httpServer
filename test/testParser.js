const { parseReqLine, parseHeader, extractField, parseRequest } = require('../src/parser.js');
const assert = require('assert');

describe('parseRequest', () => {
  it('Should parse the request line', () => {
    assert.deepStrictEqual(parseReqLine('GET / HTTP/1.1'), {
      method: 'GET', uri: '/', protocol: 'HTTP/1.1'
    });
  });
});

describe('parseHeader', () => {
  it('Should parse the Header line', () => {
    assert.deepStrictEqual(parseHeader(
      [
        'Host: localhost:8000',
        'User-Agent: curl/7.64.1',
        'Accept: */*'
      ]),
      {
        host: 'localhost:8000',
        'user-agent': 'curl/7.64.1',
        accept: '*/*'
      });
  });
});

describe('extractField', () => {
  it('should extract the field name and value', () => {
    assert.deepStrictEqual(extractField('host:localhost:8000'), { name: 'host', value: 'localhost:8000' });
  });

  it('should extract the field name and value with space', () => {
    assert.deepStrictEqual(extractField('host: localhost:8000'), { name: 'host', value: 'localhost:8000' });
  });
});

describe('parseRequest', () => {
  it('Should the parse request', () => {
    const expected = {
      method: 'GET',
      uri: '/',
      protocol: 'HTTP/1.1',
      headers: {
        host: 'localhost:8000'
      }
    };
    const request = 'GET / HTTP/1.1\r\nhost:localhost:8000';
    assert.deepStrictEqual(parseRequest(request), expected);
  });
});
