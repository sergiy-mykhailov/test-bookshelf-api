
const express = require('express');
// const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serializeError = require('./serializers/error');
const jsonApiHeaders = require('./middlewares/jsonApiHeaders');
const api = require('./api/index');
// const users  = require('./api/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// json-api headers
app.use(jsonApiHeaders);

app.use('*', api);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  const jsonApi = serializeError(status, err);

  res.status(status).json(jsonApi);
});

module.exports = app;
