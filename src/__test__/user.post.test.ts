import jwt from 'jsonwebtoken';
import request from 'supertest';

import app from '../app';
import db from '../db';
import seqielize from '../sequelize';
import { usersCreate, usersReterive, invalidUser } from './mock.data';

const { models } = seqielize;

describe('POST /v1/user', () => {
  const path = '/v1/user';

  beforeAll(async () => {
    await db.connect();

    await models.user.create(usersCreate[1], {
      include: [models.clinic],
    });
  });

  test('response 201 [success]', async () => {
    const response = await request(app).post(path).set('Content-Type', 'application/json').send(usersReterive[0]);
    expect(response.status).toBe(201);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(2);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(2);

    // Check database record content
    const { password, ...target } = usersReterive[0];

    const userFromDB: any = await models.user.findOne({
      attributes: ['id', 'clinicId', 'email'],
      where: {
        email: usersReterive[0].email,
      },
      raw: true,
    });
    expect(userFromDB.clinicId).toBeTruthy();

    const clinicFromDB = await models.clinic.findByPk(userFromDB.clinicId, {
      attributes: ['clinicName', 'phone', 'address'],
      raw: true,
    });

    expect({ email: userFromDB.email, ...clinicFromDB }).toEqual(target);

    await models.clinic.destroy({
      where: {
        id: userFromDB.clinicId,
      },
    });
    await models.user.destroy({
      where: {
        id: userFromDB.id,
      },
    });
  });

  test('response 400 [duplicate email]', async () => {
    const response = await request(app).post(path).set('Content-Type', 'application/json').send(usersReterive[1]);
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [invalid email]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        email: invalidUser.email,
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  afterAll(async () => {
    await db.close();
  });

  test('response 400 [invalid phone]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        email: invalidUser.phone,
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [invalid password]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        password: invalidUser.password,
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [missing email]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        email: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [missing password]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        password: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [missing clinicName]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        clinicName: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [missing phone]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        phone: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  test('response 400 [missing address]', async () => {
    const response = await request(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send({
        ...usersReterive[0],
        address: '',
      });
    expect(response.status).toBe(400);
    console.log(response.body);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);

    const clinicCount = await models.clinic.count();
    expect(clinicCount).toEqual(1);
  });

  afterAll(async () => {
    await db.close();
  });
});
