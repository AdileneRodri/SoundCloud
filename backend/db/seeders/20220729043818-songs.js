'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Songs', [
      {
        name: "I'm Every Women",
        url: '',
        previewImage: '',
        userId: 1,
        albumId: 1
      },
      {
        name: "Out of Time",
        url: '',
        previewImage: '',
        userId: 2,
        albumId: 2
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Songs', {
      username: { [Op.in]: ["I'm Every Women", "Out of Time"] }
    }, {});
  }
};
