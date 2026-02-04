process.env.NODE_ENV = 'test';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks para isolar testes de postagens
vi.mock('../src/config/database.js', () => ({
  default: {
    postagem: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    usuario: { findUnique: vi.fn() },
  },
}));

vi.mock('../src/middlewares/authMiddleware.js', () => ({
  default: (req, res, next) => {
    req.usuarioId = 1;
    req.user = { id: 1, tipo: 'ADMIN', isAdmin: true, role: 'ADMIN' };
    next();
  },
  authMiddleware: (req, res, next) => {
    req.usuarioId = 1;
    req.user = { id: 1, tipo: 'ADMIN', isAdmin: true, role: 'ADMIN' };
    next();
  }
}));

vi.mock('../src/services/postagemService.js', () => ({
  criarPostagem: vi.fn(),
  listarPostagens: vi.fn(),
}));

import request from 'supertest';
import app from '../src/server.js';
import * as postagemService from '../src/services/postagemService.js';

describe('Rotas de Postagem', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('POST /postagens - Deve criar um post com sucesso', async () => {
    postagemService.criarPostagem.mockResolvedValue({
      id: 100,
      titulo: 'Post Teste',
      autorId: 1
    });

    const response = await request(app)
      .post('/postagens')
      .send({
        titulo: 'Post Teste',
        conteudo: 'Conteúdo válido.',
        resumo: 'Resumo válido para teste.',
        tipo: 'post', 
        autorId: 1,
        imagem_capa: 'http://img.com/foto.png'
      });

    expect(response.status).toBe(201);
  });

  it('GET /postagens - Deve listar postagens', async () => {
    postagemService.listarPostagens.mockResolvedValue({ postagens: [] });
    const response = await request(app).get('/postagens');
    expect(response.status).toBe(200);
  });
});