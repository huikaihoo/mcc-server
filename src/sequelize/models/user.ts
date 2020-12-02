import { DataTypes, Sequelize } from 'sequelize';

const user = (sequelize: Sequelize) => {
  sequelize.define('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      type: DataTypes.UUID,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
  });
};

export default user;
