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
        is: /^$|\s+/,
      },
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        is: /^[0-9]{8}$/,
      },
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
    },
  });
};

export default clinic;
