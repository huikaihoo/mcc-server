import { Sequelize } from 'sequelize/types';

const applyAssociation = (sequelize: Sequelize) => {
  const { user, clinic } = sequelize.models;

  user.belongsTo(clinic);
};

export default { applyAssociation };
