'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Albums', [
      {
        userId: 1,
        title: 'Chaka',
        description: 'Feel good music',
        previewImage: '',
      },
      {
        userId: 2,
        title: 'Dawn FM',
        description: 'latest album',
        previewImage: '',
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Albums', null, {});
  }
};
