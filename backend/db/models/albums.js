'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Albums extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Albums.belongsTo(models.User, { foreignKey: 'userId', as: 'Artist' });
      Albums.hasMany(models.Songs, { foreignKey: 'albumId', onDelete: 'CASCADE', hooks: true })
    }
  }
  Albums.init({
    name: {
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
    modelName: 'Albums',
  });
  return Albums;
};