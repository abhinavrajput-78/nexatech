const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const config = require('../src/config/env');

test('NexaTech API Test Suite', async (t) => {
  // 1. Health check route test
  await t.test('GET /api/health returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.ok(res.body.timestamp);
    assert.ok(['connected', 'disconnected'].includes(res.body.database));
  });

  // 2. Contact validation tests
  await t.test('POST /api/contact rejects empty payload with 400', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('required'));
  });

  await t.test('POST /api/contact rejects invalid email format with 400', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'John Doe',
        email: 'invalid-email-string',
        subject: 'General Consultation',
        message: 'Looking for cloud consulting services.',
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('valid email'));
  });

  await t.test('POST /api/contact handles unavailable database gracefully', async () => {
    // When DB is disconnected, returns 503 without crashing or pretending it saved
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Enterprise Cloud Migration',
        message: 'We need help architecting multi-region Kubernetes on AWS.',
        selectedService: 'Cloud Architecture & Infrastructure',
        budget: '$50,000 - $100,000',
        timeline: '3-6 months',
      });

    // If DB is offline, returns 503; if DB happens to be online in test env, returns 201
    assert.ok([201, 503].includes(res.status));
    if (res.status === 503) {
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('unavailable'));
    }
  });

  // 3. Login input validation tests
  await t.test('POST /api/auth/login rejects empty credentials with 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('POST /api/auth/login rejects short passwords with 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@nexatech.internal',
        password: '123',
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('at least 6 characters'));
  });

  // 4. Admin authorization & protection tests
  await t.test('GET /api/admin/dashboard blocks unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Authentication required'));
  });

  await t.test('GET /api/admin/services blocks unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/admin/services');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('Admin route rejects forged/invalid tokens with 401', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Cookie', ['token=fake_invalid_token_string_12345']);
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('Admin route allows access with valid signed JWT cookie', async () => {
    const validToken = jwt.sign(
      {
        id: '64b1f2e3d4c5b6a7b8c9d0e1',
        email: 'testadmin@nexatech.internal',
        name: 'Test Administrator',
        role: 'superadmin',
      },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Cookie', [`token=${validToken}`]);

    // Allowed past authentication (either 200 if DB is up or 503 if DB is offline, but NEVER 401!)
    assert.notStrictEqual(res.status, 401);
    assert.ok([200, 503].includes(res.status));
  });

  // 5. Project URL validation check
  await t.test('POST /api/admin/projects rejects non-HTTP/HTTPS URLs with 400', async () => {
    const validToken = jwt.sign(
      {
        id: '64b1f2e3d4c5b6a7b8c9d0e1',
        email: 'testadmin@nexatech.internal',
        name: 'Test Administrator',
        role: 'superadmin',
      },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/admin/projects')
      .set('Cookie', [`token=${validToken}`])
      .send({
        title: 'Security Probe Project',
        category: 'Cybersecurity',
        summary: 'Testing URL validation filters',
        demoUrl: 'javascript:alert(1)', // Malicious non-http scheme
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('must use HTTP or HTTPS'));
  });

  // 6. Unknown API routes test
  await t.test('GET /api/nonexistent-route returns 404', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('not found'));
  });
});
