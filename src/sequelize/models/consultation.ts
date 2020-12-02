import { DataTypes, Sequelize } from 'sequelize';

const consultation = (sequelize: Sequelize) => {
  sequelize.define('consultation', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      type: DataTypes.UUID,
    },
    doctorName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        is: /^[\w\- ]+$/,
      },
    },
    patientName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        is: /^[\w\- ]+$/,
      },
    },
    diagnosis: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
    medication: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
    fee: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      unique: false,
      validate: {
        isDecimal: true,
        min: 0.01,
      },
    },
    datetime: {
      allowNull: false,
      type: DataTypes.DATE,
      unique: false,
      validate: {
        isDate: true,
        isAfter: '1900-01-01',
      },
    },
    followUp: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      unique: false,
      validate: {
        isIn: [['true', 'false']],
        notNull: true,
      },
    },
  });
};

export default consultation;
