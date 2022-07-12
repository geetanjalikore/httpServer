const CLRF2 = Buffer.from('\r\n\r\n');

const findBoundaryIndices = (boundaryBuffer, dataBuffer) => {
  const indices = [];
  let index = 0;

  while (index >= 0) {
    indices.push(index);
    const nextIndex = dataBuffer.indexOf(boundaryBuffer, index + 1);
    index = nextIndex;
  }

  return indices;
};

const findFields = (boundaryBuffer, boundaryIndices, dataBuffer) => {
  const boundaryLength = boundaryBuffer.length;
  const fields = [];
  let index = 0;

  while (index < (boundaryIndices.length - 1)) {
    const start = boundaryIndices[index] + boundaryLength;
    const end = boundaryIndices[index + 1];
    const field = dataBuffer.slice(start, end);
    fields.push(field);
    index++;
  }
  return fields;
}

const parseHeaders = (headerBuffer) => {
  let headerStr = headerBuffer.toString().trim();
  headerStr = headerStr.replaceAll('\r\n', ';');
  headerStr = headerStr.replaceAll('=', ':');

  const formHeaders = headerStr.split(';');
  const headers = {};

  formHeaders.forEach(header => {
    const [name, value] = header.trim().split(':');
    if (value) {
      headers[name.trim()] = value.trim().replaceAll('"', '');
    }
  });

  return headers;
};

const parseFields = (rawFields) => {
  const fields = [];

  rawFields.forEach((field) => {
    const separator = field.indexOf(CLRF2);
    const headers = parseHeaders(field.slice(0, separator));
    const content = field.slice(separator + CLRF2.length, -2);
    fields.push({ headers, content });
  });

  return fields;
};

const parseParams = (dataBuffer, boundaryBuffer) => {
  const boundaryIndices = findBoundaryIndices(boundaryBuffer, dataBuffer);
  const rawFields = findFields(boundaryBuffer, boundaryIndices, dataBuffer);
  const fields = parseFields(rawFields);
  return fields;
};

module.exports = { parseParams };
