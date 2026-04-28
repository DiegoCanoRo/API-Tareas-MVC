'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tareaTags', [
      { tareaId: 1, // comprar leche es cat hogar
        tagId: 2, 
        createdAt: new Date(), 
        updatedAt: new Date() }, 

      { tareaId: 2, 
        tagId: 1, 
        createdAt: new Date(), 
        updatedAt: new Date() }, // reporte es urgente

      { tareaId: 2, 
        tagId: 3, 
        createdAt: new Date(), 
        updatedAt: new Date() }  // reporta tambiene s trabajo
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tareaTags', null, {});
  }
};