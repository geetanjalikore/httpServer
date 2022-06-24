const EOL = '\r\n';

class Response {
  #socket;
  #statusCode;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
  }

  #statusLine() {
    return `HTTP/1.1 ${this.#statusCode} ok${EOL}`;
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

  #end() {
    this.#socket.end();
  }

  send(body) {
    this.#write(this.#statusLine());
    this.#write(EOL);
    this.#write(body);
    this.#end();
  }

}

module.exports = { Response };