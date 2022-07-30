'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Playlists.belongsTo(models.User, { foreignKey: 'userId' });
      Playlists.belongsToMany(models.Songs, { foreignkey: 'playlistId', through: models.PlaylistSongs, otherKey: 'songId' });
    }
  }
  Playlists.init({
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Playlists',
  });
  return Playlists;
};