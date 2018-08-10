
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const jwt = require('jsonwebtoken');
const models  = require('../models');
const config = require('../config/jwt');
const headers = require('../config/headers');

// TODO: finish docs for this api...

/**
 * @swagger
 * definitions:
 *   Bookshelf:
 *     type: array
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           type:
 *             type: string
 *             example: books
 *           id:
 *             type: number
 *             example: 1
 *           attributes:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: title
 */

/**
 * @swagger
 * /reports/bookshelf:
 *   get:
 *     summary: Get all books in user's bookshelf
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     responses:
 *       200:
 *         description: Returns array of books
 *         schema:
 *           $ref: '#/definitions/Bookshelf'
 */
const bookshelf = async (req, res, next) => {
  try {
    // TODO: finish this api...
    // const Deserializer = new JSONAPIDeserializer();
    // const Serializer = new JSONAPISerializer('users', {
    //   attributes: ['title', 'author', 'year', 'description'],
    // });

    const { user } = req;

    const data = await models.User.findAll({
      // where: { user_id: user.id },
      // attributes: ['id', 'book_id'],
      // include: [{
      //   model: models.Book,
      //   as: 'books',
      //   attributes: ['title', 'author', 'year', 'description'],
      //   include: [{
      //     model: models.Category,
      //     as: 'categories',
      //     attributes: [['name', 'category']],
      //   }],
      // }],

      where: { id: user.id },
      include: [{
        model: models.Book,
        as: 'books',
        attributes: ['title', 'author', 'year', 'description'],
      }],
    });

    console.log('data', data);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const borrowed = async (req, res, next) => {

};

module.exports = {
  bookshelf,
  borrowed,
};
