
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Borrowers', [
      {
        id: 1,
        owner_id: 1,
        user_id: 2,
        book_id: 6,
        date: new Date(2018, 5, 1),
        returnDate: new Date(2018, 8, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        owner_id: 1,
        user_id: 2,
        book_id: 8,
        date: new Date(2018, 6, 1),
        returnDate: new Date(2018, 10, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Borrowers');
  }
};
