
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Model.associate = (models) => {
    models.Book.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    models.Book.belongsToMany(models.User, {
      through: models.Bookshelf,
      foreignKey: 'book_id',
      as: 'users',
    });
  };

  return Model;
};
