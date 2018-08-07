
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Bookshelf', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  return Model;
};
