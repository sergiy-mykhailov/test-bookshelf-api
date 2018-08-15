
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Borrower', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
  });

  Model.associate = (models) => {
    models.Borrower.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner',
    });
    models.Borrower.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    models.Borrower.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'books',
    });
  };

  return Model;
};
