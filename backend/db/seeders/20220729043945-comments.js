'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comments', [
      {
        userId: 1,
        songId: 1,
        comment: "I love this song!",
      },
      {
        userId: 2,
        songId: 2,
        comment: "Love The Weeknd <3",
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
