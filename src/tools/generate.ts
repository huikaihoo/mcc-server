import bcrypt from 'bcrypt';
import moment from 'moment';

import config from '../config';
import db from '../db';
import sequelize from '../sequelize';

const genConsultation = (index: number, clinicId: string, time: number) => {
  return {
    clinicId,
    doctorName: `Doctor ${index}`,
    patientName: `Patient ${index}`,
    diagnosis: `Diagnosis ${index}`,
    medication: `Medication ${index}`,
    fee: 100 * index + 15.2,
    datetime: moment
      .unix(time)
      .add(index * 2 - 12, 'hour')
      .toDate(),
    followUp: index % 2 === 0,
  };
};

const generate = async () => {
  await db.connect();

  const { models } = sequelize;
  const time = moment().unix();

  const t = await sequelize.transaction();

  try {
    const user = await models.user.create<any>(
      {
        email: `admin${time}@test.com`,
        password: bcrypt.hashSync('b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86', config.saltRounds), // password
        clinic: {
          clinicName: 'Default Clinic',
          phone: '67812345',
          address: 'Default Address',
        },
      },
      {
        include: [models.clinic],
        transaction: t,
      }
    );

    const { id, email } = user.dataValues;
    const clinic = user.clinic.dataValues;

    const consultations = [...Array(20).keys()].map(k => genConsultation(k, clinic.id, time));
    await Promise.all(
      consultations.map(consultation => models.consultation.create<any>(consultation, { transaction: t }))
    );

    await t.commit();

    console.log('Following user is created');
    console.log('user', { id, email, password: 'password' });
    console.log('clinic', clinic);
  } catch (err) {
    console.log(err);
    await t.rollback();
  } finally {
    await db.close();
  }
};

generate();
