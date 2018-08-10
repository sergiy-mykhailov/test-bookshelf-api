
const express = require('express');
const checkAuth = require('../services/checkAuth');
const auth = require('./auth');
const reports = require('./reports');

const router  = express.Router();

const api = (passport) => {
  router.post('/signup', auth.signup);
  router.post('/signin', auth.signin);

  // router.get('/reports/bookshelf', passport.authenticate('jwt', { session: false }), reports.bookshelf);
  router.get('/reports/bookshelf', checkAuth(passport), reports.bookshelf);
  router.get('/reports/borrowed', checkAuth(passport), reports.borrowed);

  router.use((req, res, next) => {
    const err = new Error('Forbidden');
    err.status = 403;
    next(err);
  });

  return router;
};

module.exports = api;
