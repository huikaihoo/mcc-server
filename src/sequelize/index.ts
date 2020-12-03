import { Sequelize } from 'sequelize';

import config from '../config';
import setup from './setup';
import clinic from './models/clinic';
import user from './models/user';
import consultation from './models/consultation';

const sequelize = new Sequelize(config.dbUri);

const modelDefiners = [user, clinic, consultation];

// Define the model
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// Setup model associations
setup.applyAssociation(sequelize);

export default sequelize;
