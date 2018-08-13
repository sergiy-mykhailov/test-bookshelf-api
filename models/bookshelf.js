
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Bookshelf', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  Model.associate = (models) => {
    models.Bookshelf.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'books',
    });
  };

  return Model;
};
