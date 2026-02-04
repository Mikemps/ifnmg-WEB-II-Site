import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Middlewares Globais e Sistema Geral', () => {
  it('GET /health - Deve retornar status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toContain('Funcionando');
  });

  it('Deve incluir headers de segurança do Helmet', async () => {
    const response = await request(app).get('/health');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBeDefined();
  });

  it('GET /rota-inexistente - Deve retornar 404 estruturado', async () => {
    const response = await request(app).get('/rota-que-nao-existe-123');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('Deve lidar com erros de validação', async () => {
    const response = await request(app).post('/login').send({});
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api-docs - Deve servir documentação Swagger', async () => {
    const response = await request(app).get('/api-docs');
    expect([200, 301]).toContain(response.status);
    if (response.status === 200) {
      expect(response.text).toContain('swagger');
    }
  });
});