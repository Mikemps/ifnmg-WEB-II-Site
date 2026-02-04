import { describe, it, expect, vi } from 'vitest';

// 1. MOCKS (DEVEM VIR PRIMEIRO)
vi.mock('../src/config/database.js', () => ({
  default: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

vi.mock('../src/middlewares/authMiddleware.js', () => ({
  default: (req, res, next) => next(),
  authMiddleware: (req, res, next) => next(),
}));

// 2. IMPORTS
import request from 'supertest';
import app from '../src/app.js';

describe('App Geral', () => {
  it('GET /rota-inexistente - Deve retornar 404', async () => {
    const response = await request(app).get('/rota-que-nao-existe-123');
    expect(response.status).toBe(404);
  });
});