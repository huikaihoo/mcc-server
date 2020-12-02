import { Sequelize } from 'sequelize';

import setup from './setup';
import clinic from './models/clinic';
import user from './models/user';
import consultation from './models/consultation';

const sequelize = new Sequelize('postgres://admin:password@localhost:5432/db');

const modelDefiners = [user, clinic, consultation];

// Define the model
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// Setup model associations
setup.applyAssociation(sequelize);

export default sequelize;
