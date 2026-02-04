import { describe, it, expect, vi } from 'vitest';

// 1. MOCKS
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

describe('Uploads', () => {
  it('POST /upload/content-image - Deve falhar sem arquivo', async () => {
    const response = await request(app).post('/upload/content-image');
    // Espera erro do cliente (400) ou erro de servidor tratado
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});