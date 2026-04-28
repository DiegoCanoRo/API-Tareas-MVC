'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tags', [
      { id: 1, nombre: 'Urgente', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombre: 'Hogar', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nombre: 'Trabajo', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};