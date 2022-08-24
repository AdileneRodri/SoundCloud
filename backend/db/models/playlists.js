'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Playlist.belongsTo(models.User, { foreignKey: 'userId' });
      Playlist.belongsToMany(models.Song, { foreignkey: 'playlistId', through: models.PlaylistSong });
    }
  }
  Playlist.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    previewImage: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};