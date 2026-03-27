const request = require('supertest');
const app = require('../server');

describe('Server API Tests', () => {
  test('GET /api/products returns products array', async () => {
    const res = await request(app)
      .get('/api/products')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/contact POST works', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'test', email: 'test@example.com', message: 'test' })
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/admin/products without pass fails', async () => {
    const res = await request(app)
      .get('/api/admin/products')
      .expect(401);
    expect(res.body.success).toBe(false);
  });
});
