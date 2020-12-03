import config from './config';
import sequelize from './sequelize';

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    // await sequelize.query('SET timezone TO "Asia/Hong_Kong"');
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await sequelize.sync({ force: config.nodeEnv === 'TEST' });
    console.log('Connected to database!');
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
};

const close = async () => {
  try {
    await sequelize.close();
    console.log('Disconnected from database!');
  } catch (err) {
    console.error('Unable to close to database:', err);
  }
};

export default { connect, close };
