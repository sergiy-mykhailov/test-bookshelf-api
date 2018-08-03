
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = (type, data, options = {}) => {
  let attributes = options.attributes;

  if (!attributes) {
    if (Array.isArray(data) && data.length > 0) {
      attributes = Object.keys(data[0]).map((key) => key);
    } else {
      attributes = Object.keys(data).map((key) => key);
    }
  }

  const Serializer = new JSONAPISerializer(type, { attributes });

  return Serializer.serialize(data);
};
