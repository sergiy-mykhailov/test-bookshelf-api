
const express = require('express');
const passport = require('passport');
const auth = require('./auth');

const router  = express.Router();

// const models  = require('../models');
// const serializeError = require('../services/jsonApiError');
// const serializeData = require('../services/jsonApiSerializer');

router.post('/signup', auth.signup);
router.post('/signin', auth.signin);

// router.get('/', async (req, res) => {
//   try {
//     const users = await models.User.findAll({
//       include: [ models.Task ],
//     }).then(data => {
//       return (data.map((item) => (item.get())));
//     });
//
//     res.json(serializeData('users', users));
//   } catch (err) {
//     const status = err.status || 500;
//     const jsonApi = serializeError(status, err);
//
//     res.status(status).json(jsonApi);
//   }
// });

router.use((req, res, next) => {
  const err = new Error('Forbidden');
  err.status = 403;
  next(err);
});

module.exports = router;
