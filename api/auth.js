
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const jwt = require('jsonwebtoken');
const models  = require('../models');
const config = require('../config/jwt');
const headers = require('../config/headers');

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           type:
 *             type: string
 *             example: users
 *           id:
 *             type: number
 *             example: 1
 *           attributes:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jack
 *               email:
 *                 type: string
 *                 example: jack@example.com
 *               address:
 *                 type: string
 *                 example: 85 Blue str., New York, USA
 *               telephone:
 *                 type: string
 *                 example: +1(234)0000000
 *               website:
 *                 type: string
 *                 example: jack.example.com
 *
 */

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Login to the application
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: signin
 *                 attributes:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: Jack
 *                     password:
 *                       type: string
 *                       example: secretpassword
 *     responses:
 *       200:
 *         description: Returns user data
 *         schema:
 *           $ref: '#/definitions/User'
 *       400:
 *         description: username or password is not defined
 *       401:
 *         description: username or password is incorrect
 */
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

    res.header(headers.req.authorization.key, `Bearer ${token}`);
    res.json(Serializer.serialize(user));
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register new user to the application
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: signup
 *                 attributes:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: Jack
 *                     password:
 *                       type: string
 *                       example: secretpassword
 *                     email:
 *                       type: string
 *                       example: jack@example.com
 *                     address:
 *                       type: string
 *                       example: 85 Blue str., New York, USA
 *                     telephone:
 *                       type: string
 *                       example: +1(234)0000000
 *                     website:
 *                       type: string
 *                       example: jack.example.com
 *     responses:
 *       200:
 *         description: Returns user data
 *         schema:
 *           $ref: '#/definitions/User'
 */
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
