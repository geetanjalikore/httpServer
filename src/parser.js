const parseRequest = line => {
  const [method, uri, protocol] = line.split(' ');
  return { method, uri, protocol };
};

const extractField = (line) => {
  const endOfKey = line.indexOf(':');
  const name = line.slice(0, endOfKey).toLowerCase();
  const value = line.slice(endOfKey + 1).trim();
  return { name, value };
}

const parseHeader = (lines) => {
  const headers = {};
  let index = 0;
  while (index < lines.length && lines[index].length > 1) {
    const { name, value } = extractField(lines[index]);
    headers[name] = value;
    index++;
  }
  return headers;
};

module.exports = { parseRequest, parseHeader, extractField };

