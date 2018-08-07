
const express = require('express');
// const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const serializeError = require('./services/jsonApiError');
const jsonApiHeaders = require('./services/jsonApiHeaders');
const api = require('./api/index');
const jwtStrategy = require('./services/jwtStrategy');
const mediaType = require('./config/headers').req.contentType.value;

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ type: mediaType }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// json-api headers
app.use(jsonApiHeaders);

// auth
app.use(passport.initialize());
jwtStrategy(passport);

app.use('/api', api(passport));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const jsonApi = serializeError(status, err);

  res.status(status).json(jsonApi);
});

module.exports = app;
