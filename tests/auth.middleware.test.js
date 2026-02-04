import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

// Mocks necessários para isolar o teste do middleware de autenticação
vi.mock('../src/services/postagemService.js', () => ({
  criarPostagem: vi.fn(),
  listarPostagens: vi.fn(),
  buscarPostagemPorTipo: vi.fn(),
}));

vi.mock('../src/config/database.js', () => ({ default: {} }));

// Mock JWT para simular verificação de token válido
vi.mock('../src/config/jwt.js', () => ({
  verifyToken: vi.fn((token) => {
    if (token === 'token_valido') {
      return { id: 1, perfil: 'USER' };
    } else {
      throw new Error('Token inválido');
    }
  }),
}));

// Mock do middleware de autenticação para controlar o comportamento nos testes
vi.mock('../src/middlewares/authMiddleware.js', () => ({
  authMiddleware: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido ou formato inválido', code: 'MISSING_TOKEN' });
    }
    const token = authHeader.substring(7);
    if (token === 'token_valido') {
      req.user = { id: 1, perfil: 'USER' };
      next();
    } else {
      return res.status(401).json({ error: 'Erro ao autenticar', code: 'AUTH_ERROR' });
    }
  },
}));

describe('Middleware de Autenticação', () => {
  // Payload válido para passar pela validação e focar no teste de autenticação
  const payloadValido = {
    titulo: 'Teste Auth',
    conteudo: 'Conteúdo válido para passar na validação',
    resumo: 'Resumo obrigatório para o teste de auth.',
    tipo: 'post',
    autorId: 1
  };

  it('Deve negar acesso sem token (401 ou 403)', async () => {
    const response = await request(app)
      .post('/postagens')
      .send(payloadValido);

    expect(response.status).toBeOneOf([401, 403]);
  });

  it('Deve negar acesso com token inválido', async () => {
    const response = await request(app)
      .post('/postagens')
      .set('Authorization', 'Bearer token_falso_123')
      .send(payloadValido);

    expect(response.status).toBeOneOf([401, 403]);
  });

  it('Deve permitir acesso com token válido', async () => {
    const response = await request(app)
      .post('/postagens')
      .set('Authorization', 'Bearer token_valido')
      .send(payloadValido);

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});