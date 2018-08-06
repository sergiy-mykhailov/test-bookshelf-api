

const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const jwt = require('jsonwebtoken');
const models  = require('../models');
const serializeError = require('../services/jsonApiError');
const config = require('../config/jwt');
const headers = require('../config/headers');

const Op = models.Sequelize.Op;

const signin = async (req, res, next, signupUser = null) => {
  try {
    const Serializer = new JSONAPISerializer('users', {
      attributes: ['name', 'email', 'address', 'telephone', 'website'],
    });
    let name;
    let password;

    if (signupUser) {
      name = signupUser.name;
      password = signupUser.password;
    } else {
      const token = req.header(headers.req.authorization.key);

      if (!token) {
        const err = new Error('Bad Request');
        err.status = 400;
        next(err);
      }

      const decoded = jwt.verify(token, config.secret);
      name = decoded.name;
      password = decoded.password;
    }

    if (!name || !password) {
      const err = new Error('Bad Request');
      err.status = 400;
      next(err);
    }

    const user = await models.User.findOne({
      where: { name, password },
      attributes: ['id', 'name', 'email', 'address', 'telephone', 'website'],
    });

    if (!user) {
      const err = new Error('Unauthorized ');
      err.status = 401;
      next(err);
    }

    const signinToken = await jwt.sign({ id: user.id }, config.secret, { expiresIn: '1h' });

    // res.json(decoded);
    res.header(headers.req.authorization.key, signinToken);
    res.json(Serializer.serialize(user));
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    const Deserializer = new JSONAPIDeserializer();
    // const Serializer = new JSONAPISerializer('users', {
    //   attributes: ['name', 'email', 'address', 'telephone', 'website'],
    // });

    const data = await Deserializer.deserialize(req.body);
    const user = await models.User.create(data);

    // const token = jwt.sign({ foo: 'bar' }, config.secret);
    // const token = await jwt.sign({ user: user.get() }, config.secret, { expiresIn: '1h' });

    // console.log('token', token);

    // req.header('authorization', token);
    // req.token = token;
    // next(null, token);

    await signin(req, res, next, user.get());

    // res.json(Serializer.serialize(user.get()));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signin,
  signup,
};
