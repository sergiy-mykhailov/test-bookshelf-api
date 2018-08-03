
const configDev = require('../config.dev.json').database;
const configProd = require('../config.prod.json').database;

module.exports = {
  development: {
    username: configDev.username,
    password: configDev.password,
    database: configDev.database,
    host: configDev.host,
    dialect: configDev.dialect,
  },
  test: {
    username: configDev.username,
    password: configDev.password,
    database: configDev.database,
    host: configDev.host,
    dialect: configDev.dialect,
  },
  production: {
    username: process.env.DB_USERNAME || configProd.username,
    password: process.env.DB_PASSWORD || configProd.password,
    database: process.env.DB_NAME || configProd.database,
    host: process.env.DB_HOSTNAME || configProd.host,
    dialect: configProd.dialect,
    // use_env_variable: 'DATABASE_URL'
  }
};
