'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tareaTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags', // Debe coincidir con el nombre de la tabla en la DB
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Si borras el Tag, se borra la asociación
      },
      tareaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tareas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Si borras la Tarea, se borra la asociación
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tareaTags');
  }
};