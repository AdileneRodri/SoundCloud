'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Playlists', [
      {
        name: "Gym",
        userId: 1,
      },
      {
        name: "Cleaning",
        userId: 2,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Playlists', {
      username: { [Op.in]: ["Gym", "Cleaning"] }
    }, {});
  }
};
