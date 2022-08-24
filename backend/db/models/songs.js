'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Song.hasMany(models.Comment, { foreignKey: 'songId', onDelete: 'CASCADE', hooks: true })
      Song.belongsTo(models.Album, { foreignKey: 'albumId' })
      Song.belongsTo(models.User, { foreignKey: 'userId', as: 'Artist' })
      Song.belongsToMany(models.Playlist, { foreignkey: 'songId', through: models.PlaylistSong })
    }
  }
  Song.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
    },
    description: {
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
    modelName: 'Song',
  });
  return Song;
};