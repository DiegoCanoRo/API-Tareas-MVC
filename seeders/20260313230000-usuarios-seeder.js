'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
    await queryInterface.bulkDelete('Personas', null, {});

    // insertar Personas
    await queryInterface.bulkInsert('Personas', [
      { id: 1, nombre: 'Diego', apellido: 'Cano', email: 'diego.cano@uabc.edu.mx', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombre: 'Maria', apellido: 'García', email: 'maria@gmail.com', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // isertar Usuarios
    await queryInterface.bulkInsert('Usuarios', [
      { 
        id: 1, 
        nombre: 'Diego Cano',
        email: 'diego.cano@uabc.edu.mx', 
        rol: 'admin', 
        proveedor: 'local', 
        activo: true,
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: 2, 
        nombre: 'Maria García',
        email: 'maria@gmail.com', 
        rol: 'user', 
        proveedor: 'local', 
        activo: true,
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
    await queryInterface.bulkDelete('Personas', null, {});
  }
};