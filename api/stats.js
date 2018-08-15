
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const models  = require('../models');

/**
 * @swagger
 * definitions:
 *   BorrowedByCategory:
 *     type: object
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: BorrowedByCategory
 *             id:
 *               type: number
 *               example: 6
 *             attributes:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                   example: Food
 *                 books:
 *                   type: number
 *                   example: 3
 *   BorrowedByAuthor:
 *     type: object
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: BorrowedByAuthor
 *             id:
 *               type: number
 *               example: 6
 *             attributes:
 *               type: object
 *               properties:
 *                 author:
 *                   type: string
 *                   example: Jack Smith
 *                 books:
 *                   type: number
 *                   example: 2
 */

/**
 * @swagger
 * /stats/category:
 *   get:
 *     summary: Get books borrowed by category
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     responses:
 *       200:
 *         description: Returns array of books
 *         schema:
 *           $ref: '#/definitions/BorrowedByCategory'
 */
const byCategory = async (req, res, next) => {
  try {
    const Serializer = new JSONAPISerializer('borrowedByCategory', {
      attributes: ['category', 'books'],
    });
    const { user } = req;

    // Example of raw query:
    const data = await models.sequelize.query(
      'SELECT\n' +
      '  category.name as category,\n' +
      '  COUNT(books.id) AS books\n' +
      'FROM public."Borrowers" AS borrowers\n' +
      '  LEFT JOIN "Books" AS books ON borrowers.book_id = books.id\n' +
      '   LEFT JOIN "Categories" AS category ON books.category_id = category.id\n' +
      'WHERE borrowers.owner_id = :owner_id\n' +
      'GROUP BY category.name;',
      {
        replacements: { owner_id: user.id },
        type: models.sequelize.QueryTypes.SELECT,
      }
    );

    res.json(Serializer.serialize(data));
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 * /stats/author:
 *   get:
 *     summary: Get books borrowed by author
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     responses:
 *       200:
 *         description: Returns array of borrowed books
 *         schema:
 *           $ref: '#/definitions/BorrowedByAuthor'
 */
const byAuthor = async (req, res, next) => {
  try {
    const Serializer = new JSONAPISerializer('borrowedByAuthor', {
      attributes: ['author', 'books'],
    });
    const { user } = req;

    // Example of raw query:
    const data = await models.sequelize.query(
      'SELECT\n' +
      '  books.author,\n' +
      '  COUNT(books.id) AS books\n' +
      'FROM public."Borrowers" AS borrowers\n' +
      '  LEFT JOIN "Books" AS books ON borrowers.book_id = books.id\n' +
      'WHERE borrowers.owner_id = :owner_id\n' +
      'GROUP BY books.author;',
      {
        replacements: { owner_id: user.id },
        type: models.sequelize.QueryTypes.SELECT,
      }
    );

    res.json(Serializer.serialize(data));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  byCategory,
  byAuthor,
};
