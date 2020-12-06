import request from 'supertest';

import app from '../app';
import db from '../db';
import seqielize from '../sequelize';
import { usersCreate, usersReterive, genConsultation, consultationsReterive, invalidJwt } from './mock.data';

const { models } = seqielize;
const users: any[] = [];
let consultationId = '';

const login = async (user: typeof usersReterive[number]) => {
  const response = await request(app).post('/v1/signin').set('Content-Type', 'application/json').send({
    email: user.email,
    password: user.password,
  });

  expect(response.status).toBe(200);
  expect(response.body.accessToken).toBeTruthy();

  return response.body.accessToken;
};

describe('GET /v1/consultation/{consultationId}', () => {
  const path = '/v1/consultation/';

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
        const r = await Promise.all(consultations.map(consultation => models.consultation.create<any>(consultation)));

        if (i === 1) {
          consultationId = r[0].id;
        }
      }
    }
  });

  test('response 200 [success]', async () => {
    const jwt = await login(usersReterive[1]);

    const response = await request(app).get(`${path}${consultationId}`).set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body).toEqual({ id: response.body.id, ...consultationsReterive[0] });
  });

  test('response 400 [invalid consultationId]', async () => {
    const jwt = await login(usersReterive[0]);
    const response = await request(app).get(`${path}123`).set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(400);
  });

  test('response 401 [without authorization header]', async () => {
    const response = await request(app).get(`${path}123`);
    expect(response.status).toBe(401);
  });

  test('response 401 [invalid jwt]', async () => {
    const response = await request(app).get(`${path}123`).set('Authorization', `Bearer ${invalidJwt}`);
    expect(response.status).toBe(401);
  });

  test('response 404 [consultation not belongs to that user]', async () => {
    const jwt = await login(usersReterive[0]);
    const response = await request(app).get(`${path}${consultationId}`).set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await db.close();
  });
});
