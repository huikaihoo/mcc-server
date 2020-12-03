import validate from 'uuid-validate';
import sequelize from '../sequelize';

const { models } = sequelize;

const getById = async (req: any, res: any) => {
  if (!validate(req.params.consultationId)) {
    res.status(404).send();
    return;
  }

  const consultation = await models.consultation.findByPk<any>(req.params.consultationId, {
    attributes: ['id', 'clinicId', 'doctorName', 'patientName', 'diagnosis', 'medication', 'fee', 'datetime', 'followUp'],
    raw: true,
  });

  if (consultation && consultation.clinicId === req.user.clinicId) {
    delete consultation.clinicId;
    res.status(200).json(consultation);
  } else {
    res.status(404).send();
  }
};

const getList = async (req: any, res: any) => {
  // TODO: query support from and to datetime
  const { offset, limit } = req.query;

  const consultations = await models.consultation.findAndCountAll({
    attributes: ['id', 'doctorName', 'patientName', 'diagnosis', 'medication', 'fee', 'datetime', 'followUp'],
    where: {
      clinicId: req.user.clinicId,
    },
    order: ['datetime', 'createdAt'],
    offset: offset || 0,
    limit: limit || 10,
    raw: true,
  });

  if (consultations) {
    res.status(200).json({
      total: consultations.count,
      results: consultations.rows,
    });
  } else {
    res.status(404).send();
  }
};

const create = async (req: any, res: any) => {
  const t = await sequelize.transaction();

  try {
    const consultation = await models.consultation.create<any>(
      {
        doctorName: req.body.doctorName || null,
        patientName: req.body.patientName || null,
        diagnosis: req.body.diagnosis || null,
        medication: req.body.medication || null,
        fee: req.body.fee || null,
        datetime: req.body.datetime || null,
        followUp: req.body.followUp || null,
        clinicId: req.user.clinicId,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    res.status(201).send({ id: consultation.id });
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
  getList,
  create,
};
