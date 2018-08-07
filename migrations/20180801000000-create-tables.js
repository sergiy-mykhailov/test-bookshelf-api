
const models = require('../models');
const { sequelize } = models;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return sequelize.sync({ force: true });
  },
  down: (queryInterface, Sequelize) => {
    return null;
  }
};
