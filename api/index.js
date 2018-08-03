
const express = require('express');
const router  = express.Router();
const models  = require('../models');
const serializeError = require('../serializers/error');
const serializeData = require('../serializers/index');

router.get('/', async (req, res) => {
  try {
    const users = await models.User.findAll({
      include: [ models.Task ],
    }).then(data => {
      return (data.map((item) => (item.get())));
    });

    res.json(serializeData('users', users));
  } catch (err) {
    const status = err.status || 500;
    const jsonApi = serializeError(status, err);

    res.status(status).json(jsonApi);
  }
});

module.exports = router;
