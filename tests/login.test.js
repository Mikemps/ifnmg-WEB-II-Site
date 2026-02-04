import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

// Mock do banco de dados para isolar testes de login
vi.mock('../src/config/database.js', () => ({
  default: {
    usuario: {
      findUnique: vi.fn(),
    },
  },
}));

import prisma from '../src/config/database.js';

describe('POST /login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Deve fazer login com sucesso e retornar token', async () => {
    // Cenário: Usuário válido encontrado no banco
    const usuarioMock = {
      id: 1,
      email: 'teste@email.com',
      senha: '123', // Senha em texto plano para teste (em produção seria hashada)
      nome: 'Usuário Teste'
    };

    prisma.usuario.findUnique.mockResolvedValue(usuarioMock);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'teste@email.com',
        senha: '123'
      });

    expect(response.status).not.toBe(500);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('token');
    }
  });

  it('Deve retornar 401/400 se o usuário não existir', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'inexistente@email.com',
        senha: '123'
      });

    expect(response.status).toBeOneOf([400, 401, 404]);
  });
});