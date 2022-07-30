'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comments', [
      {
        comment: "I love this song!",
        userId: 1,
        songId: 1
      },
      {
        comment: "Love The Weeknd <3",
        userId: 2,
        songId: 2
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Comments', {}, {});
  }
};
