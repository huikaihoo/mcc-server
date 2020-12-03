import bcrypt from 'bcrypt';
import config from '../config';
import sequelize from '../sequelize';

const { models } = sequelize;

const getById = async (req: any, res: any) => {
  const clinic = await models.clinic.findByPk(req.user.clinicId, {
    attributes: ['clinicName', 'phone', 'address'],
    raw: true,
  });

  if (clinic) {
    res.status(200).json({ email: req.user.email, ...clinic });
  } else {
    res.status(404).send();
  }
};

const create = async (req: any, res: any) => {
  const t = await sequelize.transaction();

  try {
    await models.user.create(
      {
        email: req.body.email || null,
        password: req.body.password ? bcrypt.hashSync(req.body.password, config.saltRounds) : null,
        clinic: {
          clinicName: req.body.clinicName || null,
          phone: req.body.phone || null,
          address: req.body.address || null,
        },
      },
      {
        include: [models.clinic],
        transaction: t,
      }
    );
    await t.commit();

    res.status(201).end();
  } catch (err) {
    await t.rollback();

    res.status(400).send({
      name: err.name,
      type: err.errors[0].type,
      message: err.errors[0].message,
    });
  }
};

export default {
  getById,
  create,
};
