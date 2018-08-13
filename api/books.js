
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const models  = require('../models');

/**
 * @swagger
 * definitions:
 *   Book:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           type:
 *             type: string
 *             example: books
 *           id:
 *             type: number
 *             example: 6
 *           attributes:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Food Lab
 *               author:
 *                 type: string
 *                 example: J. Kenji Lopez-Alt
 *               year:
 *                 type: date
 *                 example: 2015-09-20T21:00:00.000Z
 *               description:
 *                 type: string
 *                 example: One of the 12 Best Books...
 *               category:
 *                 type: string
 *                 example: Food
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book info
 *     parameters:
 *       - in: path
 *         name: book_id
 *         description: book identifier
 *         type: number
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     responses:
 *       200:
 *         description: Returns object with book info
 *         schema:
 *           $ref: '#/definitions/Book'
 *       404:
 *         description: The book is not found or book is not present in the bookshelf
 */
const read = async (req, res, next) => {
  try {
    const Serializer = new JSONAPISerializer('books', {
      attributes: ['title', 'author', 'year', 'description', 'category'],
    });
    const { user } = req;
    const bookId = Number.parseInt(req.params.book_id);

    const data = await models.Bookshelf.findOne({
      where: { user_id: user.id },
      attributes: ['book_id'],
      include: [{
        model: models.Book,
        as: 'books',
        where: { id: bookId },
        attributes: ['id', 'title', 'author', 'year', 'description'],
        include: [{
          model: models.Category,
          as: 'category',
          attributes: ['name'],
        }],
      }],
    });

    if (!data) {
      const err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    const bookshelf = data.get();
    const book =  {
      id: bookshelf.book_id,
      title: bookshelf.books.title,
      author: bookshelf.books.author,
      year: bookshelf.books.year,
      description: bookshelf.books.description,
      category: bookshelf.books.category.name,
    };

    res.json(Serializer.serialize(book));
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book to bookshelf
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
 *                   example: books
 *                 attributes:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Flying Book
 *                     author:
 *                       type: string
 *                       example: McDonnell Douglas
 *                     year:
 *                       type: date
 *                       example: 2010-09-20T21:00:00.000Z
 *                     description:
 *                       type: string
 *                       example: This book about airplanes and flies...
 *                     category:
 *                       type: string
 *                       example: History
 *     responses:
 *       200:
 *         description: Returns book data
 *         schema:
 *           $ref: '#/definitions/Book'
 */
const create = async (req, res, next) => {
  try {
    const Deserializer = new JSONAPIDeserializer();
    const Serializer = new JSONAPISerializer('books', {
      attributes: ['title', 'author', 'year', 'description', 'category'],
    });
    const { user } = req;

    const data = await Deserializer.deserialize(req.body);

    let category;
    category = await models.Category.findOne({
      where: {
        $or: [
          { name: data.category },
          { name: { $ilike: `%${data.category}%`}},
        ],
      },
    });

    if (!category) {
      category = await models.Category.create({ name: data.category });
    }

    const category_id = (category) ? category.get('id') : null;
    const categoryName = (category) ? category.get('name') : null;

    const book = await models.Book.create({ ...data, category_id });
     if (!book) {
      const err = new Error('Conflict');
      err.status = 409;
      return next(err);
    }

    const bookshelf = await models.Bookshelf.create({ user_id: user.id, book_id: book.get('id') });
    if (!bookshelf) {
      const err = new Error('Conflict');
      err.status = 409;
      return next(err);
    }

    const newBook = {
      id: book.get('id'),
      title: book.get('title'),
      author: book.get('author'),
      year: book.get('year'),
      description: book.get('description'),
      category: categoryName,
    };

    res.json(Serializer.serialize(newBook));
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
// TODO: finish update-api
  const err = new Error('Not Implemented ');
  err.status = 501;
  return next(err);
};

const del = async (req, res, next) => {
// TODO: finish delete-api
  const err = new Error('Not Implemented ');
  err.status = 501;
  return next(err);
};

const borrow = async (req, res, next) => {
// TODO: finish borrow-api
  const err = new Error('Not Implemented ');
  err.status = 501;
  return next(err);
};

module.exports = {
  read,
  create,
  update,
  del,
  borrow,
};
