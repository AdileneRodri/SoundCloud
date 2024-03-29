'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Songs', [
      {
        userId: 1,
        albumId: 1,
        title: "I'm Every Woman",
        url: '',
        description: 'favorite songs',
        previewImage: '',
      },
      {
        userId: 2,
        albumId: 2,
        title: "Out of Time",
        url: '',
        description: 'favorite songs',
        previewImage: '',
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Songs', null, {});
  }
};
