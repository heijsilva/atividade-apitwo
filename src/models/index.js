import Sequelize from 'sequelize';
import user from './user';
import message from './message';
import refreshToken from './refreshToken';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const models = {
  User: user(sequelize, Sequelize.DataTypes),
  Message: message(sequelize, Sequelize.DataTypes),
  RefreshToken: refreshToken(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;