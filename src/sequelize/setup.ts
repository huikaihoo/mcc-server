import { Sequelize } from 'sequelize/types';

const applyAssociation = (sequelize: Sequelize) => {
  const { user, clinic, consultation } = sequelize.models;

  user.belongsTo(clinic);
  consultation.belongsTo(clinic);
};

export default { applyAssociation };
