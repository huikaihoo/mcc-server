import request from 'supertest';
import app from '../app';

describe('GET /health', () => {
  const path = '/health';

  test('response 200', async () => {
    const response = await request(app).get(path);
    expect(response.status).toBe(200);
  });
});

describe('GET /not-exist', () => {
  const path = '/not-exist';

  test('response 404', async () => {
    const response = await request(app).get(path);
    expect(response.status).toBe(404);
  });
});
