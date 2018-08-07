
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This category is already exist.',
      },
    },
  });

  return Model;
};
