
const JSONAPIError = require('jsonapi-serializer').Error;

module.exports = (status, err) => {
  return new JSONAPIError({
    code: status,
    title: err.name,
    detail: err.message,
  });
};