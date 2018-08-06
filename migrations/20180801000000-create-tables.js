'use strict';

const models = require('../models');
const { sequelize } = models;

module.exports = {
  up: (queryInterface, Sequelize) => {

    // console.log('User', models.User);

    return sequelize.sync({ logging: console.log });

    // return queryInterface.createTable('Users', {}, {}, models.User);

    // return queryInterface.createTable('Users', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   name: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //     unique: {
    //       msg: 'This username is already taken.',
    //     },
    //     validate: {
    //       len: [5, 100],
    //     },
    //   },
    //   email: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //     unique: {
    //       msg: 'This email is already taken.',
    //     },
    //     validate: {
    //       isEmail: true,
    //     },
    //   },
    //   address: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   telephone: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   website: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // });
  },
  down: (queryInterface, Sequelize) => {
    return null;
    // return queryInterface.dropTable('Users');
  }
};