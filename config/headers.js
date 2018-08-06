
module.exports = {
  req: {
    contentType: {
      key: 'Content-Type',
      value: 'application/vnd.api+json',
    },
    accept: {
      key: 'Accept',
      value: 'application/vnd.api+json',
    },
    authorization: {
      key: 'Authorization',
    }
  },
  res: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
  }
};