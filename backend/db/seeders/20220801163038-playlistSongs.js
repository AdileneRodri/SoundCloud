'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PlaylistSongs', [
      {
        playlistId: 1,
        songId: 1
      },
      {
        playlistId: 2,
        songId: 2
      },
     ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PlaylistSongs', null, {});
  }
};
