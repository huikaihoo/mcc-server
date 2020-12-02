import { DataTypes, Sequelize } from 'sequelize';

const clinic = (sequelize: Sequelize) => {
  sequelize.define('clinic', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      type: DataTypes.UUID,
    },
    clinicName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        is: /^[\w\- ]+$/,
      },
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        is: /^[1-9][0-9]{7}$/,
      },
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
  });
};

export default clinic;
