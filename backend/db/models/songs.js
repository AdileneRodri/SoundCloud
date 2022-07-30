'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Songs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Songs.hasMany(models.Comments, { foreignKey: 'songId', onDelete: 'CASCADE', hooks: true })
      Songs.belongsTo(models.Albums, { foreignKey: 'albumId' })
      Songs.belongsTo(models.User, { foreignKey: 'userId' })
      Songs.belongsToMany(models.Playlists, { foreignkey: 'songId', through: models.PlaylistSongs, otherKey: 'playlistId' })
    }
  }
  Songs.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
    },
    previewImage: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Songs',
  });
  return Songs;
};