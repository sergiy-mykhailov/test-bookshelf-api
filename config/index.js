
const configDev = require('../config.dev.json').app;
const configProd = require('../config.prod.json').app;

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    host: configProd.host,
    port: configProd.port,
  },
  test: {
    host: configProd.host,
    port: configProd.port,
  },
  production: {
    host: process.env.HOST || configProd.host,
    port: process.env.PORT || configProd.port,
  }
};

module.exports = config[env];
