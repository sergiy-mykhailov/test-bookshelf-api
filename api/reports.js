
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const models  = require('../models');

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
 *   Borrowed:
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
 *                 borrowerId:
 *                   type: number
 *                   example: 2
 *                 date:
 *                   type: date
 *                   example: 2015-09-20T21:00:00.000Z
 *                 returnDate:
 *                   type: date
 *                   example: 2018-09-20T21:00:00.000Z
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
        category: book.books.category && book.books.category.name,
      }
    });

    res.json(Serializer.serialize(books));
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 * /reports/borrowed:
 *   get:
 *     summary: Get all books that borrowed to another user
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     responses:
 *       200:
 *         description: Returns array of borrowed books
 *         schema:
 *           $ref: '#/definitions/Borrowed'
 */
const borrowed = async (req, res, next) => {
  try {
    const Serializer = new JSONAPISerializer('books', {
      attributes: ['borrowerId', 'date', 'returnDate', 'title', 'author', 'year', 'description', 'category'],
      keyForAttribute: 'camelCase',
    });
    const { user } = req;

    const data = await models.Borrower.findAll({
      where: { owner_id: user.id },
      attributes: ['id', 'user_id', 'date', 'returnDate'],
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

    const borrowed = data.map((item) => {
      const borrower = item.get();
      return {
        id: borrower.id,
        borrowerId: borrower.user_id,
        date: borrower.date,
        returnDate: borrower.returnDate,
        title: borrower.books.title,
        author: borrower.books.author,
        year: borrower.books.year,
        description: borrower.books.description,
        category: borrower.books.category && borrower.books.category.name,
      }
    });

    res.json(Serializer.serialize(borrowed));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  bookshelf,
  borrowed,
};
