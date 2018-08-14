
const extractFields = (inputs, names) => {
  const fields = {};

  names.forEach((name) => {
    if (inputs.hasOwnProperty(name)) {
      const value = inputs[name];

      if (value !== undefined) {
        fields[name] = value;
      }
    }
  });

  return fields;
};

module.exports = {
  extractFields,
};
