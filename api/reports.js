
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const jwt = require('jsonwebtoken');
const models  = require('../models');
const config = require('../config/jwt');
const headers = require('../config/headers');

/**
 * @swagger
 * definitions:
 *   Bookshelf:
 *     type: object
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: books
 *             id:
 *               type: number
 *               example: 6
 *             attributes:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: The Food Lab
 *                 author:
 *                   type: string
 *                   example: J. Kenji Lopez-Alt
 *                 year:
 *                   type: date
 *                   example: 2015-09-20T21:00:00.000Z
 *                 description:
 *                   type: string
 *                   example: One of the 12 Best Books...
 *                 category:
 *                   type: string
 *                   example: Food
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
    const Serializer = new JSONAPISerializer('books', {
      attributes: ['title', 'author', 'year', 'description', 'category'],
    });
    const { user } = req;

    const data = await models.Bookshelf.findAll({
      where: { user_id: user.id },
      attributes: ['id', 'book_id'],
      include: [{
        model: models.Book,
        as: 'books',
        attributes: ['title', 'author', 'year', 'description'],
        include: [{
          model: models.Category,
          as: 'category',
          attributes: ['name'],
        }],
      }],
    });

    const books = data.map((item) => {
      const book = item.get();
      return {
        id: book.id,
        title: book.books.title,
        author: book.books.author,
        year: book.books.year,
        description: book.books.description,
        category: book.books.category.name,
      }
    });

    res.json(Serializer.serialize(books));
  } catch (err) {
    next(err);
  }
};

// TODO: finish docs for borrowed-api
const borrowed = async (req, res, next) => {
// TODO: finish borrowed-api
};

module.exports = {
  bookshelf,
  borrowed,
};
