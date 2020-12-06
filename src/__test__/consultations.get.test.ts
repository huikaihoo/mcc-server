import request from 'supertest';

import app from '../app';
import db from '../db';
import seqielize from '../sequelize';
import { usersCreate, usersReterive, genConsultation, invalidJwt } from './mock.data';

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

describe('GET /v1/consultations', () => {
  const path = '/v1/consultations';

  beforeAll(async () => {
    await db.connect();

    const consultationsCount = [4, 1];

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

      if (consultationsCount[i]) {
        const consultations = [...Array(consultationsCount[i]).keys()].map(k => genConsultation(k, users[i].clinicId));
        await Promise.all(consultations.map(consultation => models.consultation.create<any>(consultation)));
      }
    }
  });

  test('response 200 [success with records]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(4);
    expect(response.body.results.length).toEqual(4);
  });

  test('response 200 [success with records using offset / limit]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`).query({ offset: '3', limit: '2' });

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(4);
    expect(response.body.results.length).toEqual(1);
  });

  test('response 200 [success with records using from]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`).query({ from: '1607126400' });

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(3);
    expect(response.body.results.length).toEqual(3);
  });

  test('response 200 [success with records using to]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`).query({ to: '1607299200' });

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(3);
    expect(response.body.results.length).toEqual(3);
  });

  test('response 200 [success with records using from / to]', async () => {
    const jwt = await login(usersReterive[0]);

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`).query({ from: '1607126400', to: '1607299200' });

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(2);
    expect(response.body.results.length).toEqual(2);
  });

  test('response 200 [success without records]', async () => {
    const jwt = await login(usersReterive[2]);

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(0);
    expect(response.body.results.length).toEqual(0);
  });

  test('response 401 [without authorization header]', async () => {
    const response = await request(app).get(path);
    expect(response.status).toBe(401);
  });

  test('response 401 [invalid jwt]', async () => {
    const response = await request(app).get(path).set('Authorization', `Bearer ${invalidJwt}`);
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await db.close();
  });
});
