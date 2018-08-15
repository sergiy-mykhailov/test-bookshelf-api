
const express = require('express');
const checkAuth = require('../services/checkAuth');
const auth = require('./auth');
const reports = require('./reports');
const books = require('./books');
const stats = require('./stats');

const router  = express.Router();

const api = (passport) => {
  router.post('/signup', auth.signup);
  router.post('/signin', auth.signin);

  router.get('/reports/bookshelf', checkAuth(passport), reports.bookshelf);
  router.get('/reports/borrowed', checkAuth(passport), reports.borrowed);

  router.get('/books/:book_id', checkAuth(passport), books.read);
  router.post('/books', checkAuth(passport), books.create);
  router.patch('/books/:book_id', checkAuth(passport), books.update);
  router.delete('/books/:book_id', checkAuth(passport), books.del);
  router.post('/books/:book_id/borrow/:user_id', checkAuth(passport), books.borrow);

  router.get('/stats/category', checkAuth(passport), stats.byCategory);
  router.get('/stats/author', checkAuth(passport), stats.byAuthor);

  router.use((req, res, next) => {
    const err = new Error('Forbidden');
    err.status = 403;
    next(err);
  });

  return router;
};

module.exports = api;
