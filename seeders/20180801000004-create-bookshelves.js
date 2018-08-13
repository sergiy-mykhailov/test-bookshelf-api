
const models = require('../models/index');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const books = await models.Book.findAll().map((item) => (item.get('id')));

    const bookshelf = books.map((item) => ({
        user_id: (item % 2 === 0) ? 1 : 2,
        book_id: item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    return queryInterface.bulkInsert('Bookshelves', bookshelf);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bookshelves');
  }
};
