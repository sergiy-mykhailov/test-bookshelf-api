
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const models  = require('../models');
const utils  = require('../services/utils');

const writableFieldsBook = (params) => {
  return utils.extractFields(params, [
    'title',
    'author',
    'year',
    'description',
    'category_id',
  ]);
};

const writableFieldsBookshelf = (params) => {
  return utils.extractFields(params, [
    'user_id',
    'book_id',
  ]);
};

const writableFieldsCategory = (params) => {
  return utils.extractFields(params, [
    'name',
  ]);
};

const writableFieldsBorrower = (params) => {
  return utils.extractFields(params, [
    'owner_id',
    'user_id',
    'book_id',
    'date',
    'returnDate',
  ]);
};

const getBookInfoFromBookshelf = async (req, res, next) => {
  const { user } = req;
  const bookId = Number.parseInt(req.params.book_id);

  const data = await models.Bookshelf.findOne({
    where: { user_id: user.id },
    attributes: [['id', 'bookshelf_id'], 'book_id'],
    include: [{
      model: models.Book,
      as: 'books',
      where: { id: bookId },
      attributes: ['id', 'title', 'author', 'year', 'description'],
      include: [{
        model: models.Category,
        as: 'category',
        attributes: ['id', 'name'],
      }],
    }],
  });

  if (!data) {
    const err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }

  const bookshelf = data.get();

  return {
    bookshelf_id: bookshelf.bookshelf_id,
    id: bookshelf.book_id,
    title: bookshelf.books.title,
    author: bookshelf.books.author,
    year: bookshelf.books.year,
    description: bookshelf.books.description,
    category: bookshelf.books.category.name,
  };
};

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
 *   Borrower:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           type:
 *             type: string
 *             example: borrower
 *           id:
 *             type: number
 *             example: 6
 *           attributes:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 2
 *               date:
 *                 type: date
 *                 example: 2015-09-20T21:00:00.000Z
 *               returnDate:
 *                 type: date
 *                 example: 2018-09-20T21:00:00.000Z
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

    const book = await getBookInfoFromBookshelf(req, res, next);
    if (!book) {
      return null;
    }

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
 *       409:
 *         description: Resource already exists
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
      category = await models.Category.create(writableFieldsCategory({ name: data.category }));
    }

    const category_id = (category) ? category.get('id') : null;
    const categoryName = (category) ? category.get('name') : null;

    const book = await models.Book.create(writableFieldsBook({
      ...data,
      category_id,
    }));
    if (!book) {
      const err = new Error('Conflict');
      err.status = 409;
      return next(err);
    }

    const bookshelf = await models.Bookshelf.create(writableFieldsBookshelf({
      user_id: user.id,
      book_id: book.get('id'),
    }));
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

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update book info
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     parameters:
 *       - in: path
 *         name: book_id
 *         description: book identifier
 *         type: number
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
 *                       example: new book title
 *                     author:
 *                       type: string
 *                       example: new book author
 *                     year:
 *                       type: date
 *                       example: 2010-09-20T21:00:00.000Z
 *                     description:
 *                       type: string
 *                       example: new book description...
 *                     category:
 *                       type: string
 *                       example: History
 *     responses:
 *       200:
 *         description: Returns book data
 *         schema:
 *           $ref: '#/definitions/Book'
 *       404:
 *         description: The book is not found or book is not present in the bookshelf
 */
const update = async (req, res, next) => {
  try {
    const Deserializer = new JSONAPIDeserializer();
    const Serializer = new JSONAPISerializer('books', {
      attributes: ['title', 'author', 'year', 'description', 'category'],
    });
    const bookId = Number.parseInt(req.params.book_id);

    const bookOnBookshelf = await getBookInfoFromBookshelf(req, res, next);
    if (!bookOnBookshelf) {
      return null;
    }

    const data = await Deserializer.deserialize(req.body);
    const updatedBook = {};
    let category = null;

    if (data.category) {
      category = await models.Category.findOne({ where: { name: { $ilike: `%${data.category}%`}} });
      if (!category) {
        category = await models.Category.create(writableFieldsCategory({ name: data.category }));
      }
      updatedBook.category = category.get('name');
    }

    const bookData = (!category) ? data : { ...data, category_id: category.get('id') };
    const bookFields = writableFieldsBook(bookData);

    if (Object.keys(bookFields).length > 0) {
      const [affectedCount , books] = await models.Book.update(bookFields, {
        where: { id: bookId },
        returning: true,
      });
      if (books.length > 0) {
        updatedBook.id = books[0].get('id');
        updatedBook.title = books[0].get('title');
        updatedBook.author = books[0].get('author');
        updatedBook.year = books[0].get('year');
        updatedBook.description = books[0].get('description');
      }
    }

    res.json(Serializer.serialize(updatedBook));
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete book from bookshelf
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     parameters:
 *       - in: path
 *         name: book_id
 *         description: book identifier
 *         type: number
 *     responses:
 *       200:
 *         description: Returns book data
 *         schema:
 *           $ref: '#/definitions/Book'
 *       404:
 *         description: The book is not found or book is not present in the bookshelf
 */
const del = async (req, res, next) => {
  try {
    const Serializer = new JSONAPISerializer('books', {
      attributes: ['title', 'author', 'year', 'description', 'category'],
    });

    const book = await getBookInfoFromBookshelf(req, res, next);
    if (!book) {
      return null;
    }

    const deleted = await models.Bookshelf.destroy({
      where: { id: book.bookshelf_id },
      returning: true,
    });

    if (deleted === 0) {
      const err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    res.json(Serializer.serialize(book));
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 * /books/{book_id}/borrow/{user_id}:
 *   post:
 *     summary: Add borrowed book
 *     produces:
 *       - application/vnd.api+json
 *     consumes:
 *       - application/vnd.api+json
 *     parameters:
 *       - in: path
 *         name: book_id
 *         description: book identifier
 *         type: number
 *       - in: path
 *         name: user_id
 *         description: borrower identifier
 *         type: number
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: borrower
 *                 attributes:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: date
 *                       example: 2018-07-23T22:00:00.000Z
 *                     returnDate:
 *                       type: string
 *                       example: 2018-10-23T22:00:00.000Z
 *     responses:
 *       200:
 *         description: Returns borrower data
 *         schema:
 *           $ref: '#/definitions/Borrower'
 *       400:
 *         description: Body parameters are not set
 *       404:
 *         description: The book is not found or book is not present in the bookshelf
 *       409:
 *         description: Borrower already exists
 */
const borrow = async (req, res, next) => {
  try {
    const Deserializer = new JSONAPIDeserializer({ keyForAttribute: 'camelCase' });
    const Serializer = new JSONAPISerializer('borrower', {
      attributes: ['user_id', 'date', 'returnDate'],
      keyForAttribute: 'camelCase',
    });

    if (!req.body || Object.keys(req.body).length === 0) {
      const err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }

    const book = await getBookInfoFromBookshelf(req, res, next);
    if (!book) {
      return null;
    }

    const book_id = Number.parseInt(req.params.book_id);
    const user_id = Number.parseInt(req.params.user_id);
    const owner_id = Number.parseInt(req.user.id);

    const data = await Deserializer.deserialize(req.body);

    const borrower = await models.Borrower.create(writableFieldsBorrower({
      ...data,
      owner_id,
      user_id,
      book_id,
    }));

    if (!borrower) {
      const err = new Error('Conflict');
      err.status = 409;
      return next(err);
    }

    res.json(Serializer.serialize(borrower));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  read,
  create,
  update,
  del,
  borrow,
};
