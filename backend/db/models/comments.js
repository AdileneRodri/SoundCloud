'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.User, { foreignKey: 'userId' });
      Comments.belongsTo(models.Songs, { foreignKey: 'songId' });
    }
  }
  Comments.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};