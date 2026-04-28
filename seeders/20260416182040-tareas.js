'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tareas', [
      { 
        id: 1, 
        titulo: 'Comprar leche', 
        descripcion: 'Ir al súper por leche deslactosada', 
        categoria: 'Compras', 
        completada: false, 
        personaId: 1, // Juan
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: 2, 
        titulo: 'Reporte Mensual', 
        descripcion: 'Enviar balance a gerencia', 
        categoria: 'Oficina', 
        completada: false, 
        personaId: 2, // Maria
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tareas', null, {});
  }
};