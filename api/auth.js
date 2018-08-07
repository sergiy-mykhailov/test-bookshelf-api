
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const jwt = require('jsonwebtoken');
const models  = require('../models');
// const serializeError = require('../services/jsonApiError');
const config = require('../config/jwt');
const headers = require('../config/headers');

// const Op = models.Sequelize.Op;

const signin = async (req, res, next, signupUser = null) => {
  try {
    const Deserializer = new JSONAPIDeserializer();
    const Serializer = new JSONAPISerializer('users', {
      attributes: ['name', 'email', 'address', 'telephone', 'website'],
    });
    const payload = await Deserializer.deserialize(req.body);
    let { username, password }  = payload;

    if (signupUser) {
      username = signupUser.username;
      password = signupUser.password;
    }

    if (!username || !password) {
      const err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }

    const data = await models.User.findOne({
      where: { username, password },
      attributes: ['id', ['username', 'name'], 'email', 'address', 'telephone', 'website'],
    });

    if (!data) {
      const err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }

    const user = data.get();
    const token = await jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1h' });

    res.header(headers.req.authorization.key, token);
    res.json(Serializer.serialize(user));
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    const Deserializer = new JSONAPIDeserializer();

    const data = await Deserializer.deserialize(req.body);
    const user = await models.User.create(data);

    await signin(req, res, next, user.get());
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signin,
  signup,
};
