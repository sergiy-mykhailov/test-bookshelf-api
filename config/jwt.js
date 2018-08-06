
const configDev = require('../config.dev.json').jwt;
const configProd = require('../config.prod.json').jwt;

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    secret: configDev.secret,
  },
  test: {
    secret: configDev.secret,
  },
  production: {
    secret: process.env.JWT_SECRET || configProd.secret,
  }
};

module.exports = config[env];
