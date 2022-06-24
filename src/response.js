const EOL = '\r\n';

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  #statusLine() {
    return `HTTP/2 ${this.#statusCode} ok${EOL}`;
  }

  #write(content) {
    this.#socket.write(content);
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  get statusCode() {
    return this.#statusCode;
  }

  setHeader(fieldName, fieldValue) {
    this.#headers[fieldName] = fieldValue;
  }

  #writeHeaders() {
    Object.entries(this.#headers).forEach(([name, value]) => {
      this.#write(`${name}:${value}${EOL}`);
    });
  };

  #end() {
    this.#socket.end();
  }

  send(body) {
    this.#write(this.#statusLine());
    this.#writeHeaders();
    this.#write(EOL);
    this.#write(body);
    this.#end();
  }
}

module.exports = { Response };
