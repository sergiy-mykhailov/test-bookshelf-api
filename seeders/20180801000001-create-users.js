
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        username: 'Maximus',
        password: 'abc123',
        email: 'maximus@example.com',
        address: '85 Blue str., New York, USA',
        telephone: '+1(234)0000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'Hannah',
        password: 'qwe1ewq',
        email: 'hannah@example.com',
        address: 'Ibiza',
        telephone: '+1(000)1234567',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users');
  }
};
