const refreshToken = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('refreshToken', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User);
  };

  return RefreshToken;
};

export default refreshToken;