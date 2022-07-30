'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Albums', [
      {
        name: 'Chaka',
        previewImage: '',
        userId: 1
      },
      {
        name: 'Dawn FM',
        previewImage: '',
        userId: 2
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Albums', {
      username: { [Op.in]: ['Chaka', 'Dawn FM'] }
    }, {});
  }
};
