import request from 'supertest';

import app from '../app';
import db from '../db';
import seqielize from '../sequelize';
import { usersCreate, usersReterive, genConsultation, invalidJwt, invalidConsultation } from './mock.data';

const { models } = seqielize;
const users: any[] = [];

const login = async (user: typeof usersReterive[number]) => {
  const response = await request(app).post('/v1/signin').set('Content-Type', 'application/json').send({
    email: user.email,
    password: user.password,
  });

  expect(response.status).toBe(200);
  expect(response.body.accessToken).toBeTruthy();

  return response.body.accessToken;
};

describe('POST /v1/consultation', () => {
  const path = '/v1/consultation';

  beforeAll(async () => {
    await db.connect();

    for (const [i, user] of usersCreate.entries()) {
      await models.user.create(user, {
        include: [models.clinic],
      });
      users[i] = await models.user.findOne({
        attributes: ['id', 'clinicId'],
        where: {
          email: user.email,
        },
        raw: true,
      });
    }
  });

  test('response 201 [success]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app).post(path).set('Authorization', `Bearer ${jwt}`).set('Content-Type', 'application/json').send(genConsultation(0));
    expect(response.status).toBe(201);
    expect(response.body.id).toBeTruthy();

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(1);

    // Check database record content
    const consultationFromDB = await models.consultation.findByPk<any>(response.body.id, {
      attributes: ['doctorName', 'patientName', 'diagnosis', 'medication', 'fee', 'datetime', 'followUp'],
      raw: true,
    });

    expect(consultationFromDB).toEqual(genConsultation(0));

    await models.consultation.destroy({
      where: {
        id: response.body.id,
      },
    });
  });

  test('response 400 [invalid fee]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        fee: invalidConsultation.fee,
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [invalid datetime]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        datetime: invalidConsultation.datetime,
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing doctorName]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        doctorName: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing patientName]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        patientName: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing diagnosis]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        diagnosis: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing medication]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        medication: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing fee]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        fee: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing datetime]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        datetime: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 400 [missing followUp]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app)
      .post(path)
      .set('Authorization', `Bearer ${jwt}`)
      .set('Content-Type', 'application/json')
      .send({
        ...genConsultation(0),
        followUp: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const consultationCount = await models.consultation.count();
    expect(consultationCount).toEqual(0);
  });

  test('response 401 [without authorization header]', async () => {
    const response = await request(app).post(path);
    expect(response.status).toBe(401);
  });

  test('response 401 [invalid jwt]', async () => {
    const response = await request(app).post(path).set('Authorization', `Bearer ${invalidJwt}`);
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await db.close();
  });
});
