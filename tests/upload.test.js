import { describe, it, expect, vi } from 'vitest';

// Mocks para testes de upload
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

import request from 'supertest';
import app from '../src/server.js';

describe('Uploads', () => {
  it('POST /upload/content-image - Deve falhar sem arquivo', async () => {
    const response = await request(app).post('/upload/content-image');
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});