'use strict';
const bcrypt = require("bcryptjs");


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Jane',
        lastName: 'Doe',
        previewImage: '',
        hashedPassword: bcrypt.hashSync('password'),
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'Adi',
        lastName: 'Rodriguez',
        previewImage: '',
        hashedPassword: bcrypt.hashSync('password2'),
        isArtist: false
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Random',
        lastName: 'Dude',
        previewImage: '',
        hashedPassword: bcrypt.hashSync('password3'),
        isArtist: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};

