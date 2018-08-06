
const headers = require('../config/headers');

const getMediaTypes = () => {
  return [
    'application/',
    'audio/',
    'font/',
    'example/',
    'image/',
    'message/',
    'model/',
    'multipart/',
    'text/',
    'video/',
  ];
};

const isMediaType = (str) => {
  const arr = getMediaTypes();
  let result = false;

  for (let i = 0; i < arr.length; i++) {
    result = str.startsWith(arr[i]);
    if (result) break;
  }

  return result;
};

const isForbiddenMediaType = (mediaType, value) => {
  const arr = mediaType.split(';').map((item) => (item.trim()));
  const index = arr.indexOf(value);

  if (index === -1) {
    return true;
  }

  arr.splice(index, 1);

  let result = false;
  for (let i = 0; i < arr.length; i++) {
    result = isMediaType(arr[i]);
    if (result) break;
  }

  return result;
};

module.exports = (req, res, next) => {
  // response headers
  Object.keys(headers.res).forEach((header) => {
    res.header(header, headers.res[header]);
  });

  // request headers
  const contentType = req.header(headers.req.contentType.key);
  if (!contentType || isForbiddenMediaType(contentType.toLowerCase(), headers.req.contentType.value)) {
    const err = new Error('Unsupported Media Type');
    err.status = 415;
    return next(err);
  }

  const accept = req.header(headers.req.accept.key);
  if (!accept || isForbiddenMediaType(accept.toLowerCase(), headers.req.accept.value)) {
    const err = new Error('Not Acceptable');
    err.status = 406;
    return next(err);
  }

  next();
};
