import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Status e health', () => {
  it('GET /api/v1/status retorna ok', async () => {
    const res = await request(app).get('/api/v1/status');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      version: '1.0.0',
    });
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health responde JSON', async () => {
    const res = await request(app).get('/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('services');
  });
});
