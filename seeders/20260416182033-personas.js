'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Personas', [
      { id: 1, 
        nombre: 'Juan', 
        apellido: 'Pérez', 
        email: 'juan@gmail.com', 
        activo: true,
        createdAt: new Date(), 
        updatedAt: new Date() },

      { id: 2, 
        nombre: 'Maria', 
        apellido: 'García', 
        email: 'maria@gmail.com', 
        activo: true,
        createdAt: new Date(), 
        updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Personas', null, {});
  }
};