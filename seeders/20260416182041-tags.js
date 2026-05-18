'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});

    await queryInterface.bulkInsert('Tags', [
      { id: 1, nombre: 'Urgente', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombre: 'Hogar', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nombre: 'Trabajo', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, nombre: 'Estudios', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, nombre: 'Salud', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, nombre: 'Finanzas', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, nombre: 'Importante', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, nombre: 'Pendiente', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};