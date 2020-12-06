import request from 'supertest';

import app from '../app';
import db from '../db';
import seqielize from '../sequelize';
import { usersCreate, usersReterive, invalidJwt } from './mock.data';

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

describe('GET /v1/user', () => {
  const path = '/v1/user';

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

  test('response 200 [success]', async () => {
    const jwt = await login(usersReterive[0]);
    const { password, ...target } = usersReterive[0];

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(target);
  });

  test('response 401 [without authorization header]', async () => {
    const response = await request(app).get(path);
    expect(response.status).toBe(401);
  });

  test('response 401 [invalid jwt]', async () => {
    const response = await request(app).get(path).set('Authorization', `Bearer ${invalidJwt}`);
    expect(response.status).toBe(401);
  });

  test('response 404 [clinic not found in database]', async () => {
    const jwt = await login(usersReterive[0]);

    await models.clinic.destroy({
      where: {
        id: users[0].clinicId,
      },
    });

    const response = await request(app).get(path).set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await db.close();
  });
});
