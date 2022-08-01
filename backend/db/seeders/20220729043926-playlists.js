'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Playlists', [
      {
        userId: 1,
        name: "Gym",
        previewImage: " "
      },
      {
        userId: 2,
        name: "Cleaning",
        previewImage: " "
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Playlists', null, {});
  }
};
