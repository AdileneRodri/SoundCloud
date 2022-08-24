'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Album.belongsTo(models.User, { foreignKey: 'userId', as: 'Artist' });
      Album.hasMany(models.Song, { foreignKey: 'albumId', onDelete: 'CASCADE', hooks: true })
    }
  }
  Album.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    previewImage: {
      type: DataTypes.STRING,
    },
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};