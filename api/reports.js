
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const jwt = require('jsonwebtoken');
const models  = require('../models');
const config = require('../config/jwt');
const headers = require('../config/headers');

const bookshelf = async (req, res, next) => {
  try {
    // TODO: finish this...
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
