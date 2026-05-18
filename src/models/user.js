const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
    User.hasMany(models.RefreshToken, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async (login) => {
    return await User.findOne({ where: { username: login } });
  };

  return User;
};

export default user;