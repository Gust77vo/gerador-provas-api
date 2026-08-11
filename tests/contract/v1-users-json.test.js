import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Contrato v1: cliente que envia JSON puro (sem multipart) continua válido.
 * Protege retrocompat após upload na v2 (aulas 8–9).
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Contract — Users v1 JSON puro', () => {
  it('POST /api/v1/users aceita JSON com foto como URL string', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'Cliente V1',
        email: `contract-v1-${Date.now()}@teste.com`,
        senha: 'senha123',
        foto: 'https://cdn.example.com/foto.jpg',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).not.toHaveProperty('senhaHash');
    expect(res.body.data).not.toHaveProperty('senha');
    expect(res.body.data.foto).toBe('https://cdn.example.com/foto.jpg');
  });

  it('POST /api/v1/users sem foto continua válido', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        nome: 'Sem Foto',
        email: `contract-nofoto-${Date.now()}@teste.com`,
        senha: 'senha123',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.foto).toBeNull();
  });
});
