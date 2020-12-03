import jwt from 'jsonwebtoken';
import request from 'supertest';

import app from '../app';
import db from '../db';
import seqielize from '../sequelize';
import { usersCreate, usersReterive } from './mock.data';

const { models } = seqielize;
const users: any[] = [];

describe('POST /v1/signin', () => {
  const path = '/v1/signin';

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
    const response = await request(app).post(path).set('Content-Type', 'application/json').send({
      email: usersReterive[0].email,
      password: usersReterive[0].password,
    });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();

    // Check payload of accessToken
    const jwtPayload: any = jwt.decode(response.body.accessToken);
    expect(jwtPayload.id).toEqual(users[0].id);
    expect(jwtPayload.clinicId).toEqual(users[0].clinicId);
  });

  test('response 400 [without body]', async () => {
    const response = await request(app).post(path);
    expect(response.status).toBe(400);
  });

  test('response 401 [invalid email]', async () => {
    const response = await request(app).post(path).set('Content-Type', 'application/json').send({
      email: 'no-exist@hello.world',
      password: usersReterive[0].password,
    });
    expect(response.status).toBe(401);
  });

  test('response 401 [invalid password]', async () => {
    const response = await request(app).post(path).set('Content-Type', 'application/json').send({
      email: usersReterive[0].email,
      password: '1234567890',
    });
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await db.close();
  });
});
