import sequelize from './sequelize';

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await sequelize.sync({ force: false });
    console.log('Connected to database!');
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
};

export default { initDB };
