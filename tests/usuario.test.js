import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks para testes de usuários
vi.mock('../src/config/database.js', () => ({
  default: {
    usuario: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
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

// 2. IMPORTS
import request from 'supertest';
import app from '../src/server.js';
import prisma from '../src/config/database.js';

describe('Rotas de Usuário', () => {
  beforeEach(() => { 
    vi.clearAllMocks();
    prisma.usuario.count.mockResolvedValue(0); // Mock para count
  });

  it('POST /usuarios - Deve criar um usuário com sucesso', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null); // Email não existe
    prisma.usuario.create.mockResolvedValue({ id: 1, nome: 'Teste' });

    const response = await request(app).post('/usuarios').send({
      nome: 'Teste Admin',
      email: 'admin.teste@email.com',
      senha: 'SenhaForte@123',
      confirmarSenha: 'SenhaForte@123',
      tipo: 'ADMIN',
      cpf: '000.000.000-00',
      telefone: '11999999999'
    });

    expect(response.status).toBe(201);
  });

  it('GET /usuarios - Deve listar usuários (Admin)', async () => {
    // Retorna Admin quando o middleware/controller buscar no banco
    const adminUser = { id: 1, tipo: 'ADMIN', isAdmin: true, role: 'ADMIN' };
    prisma.usuario.findUnique.mockResolvedValue(adminUser);
    prisma.usuario.findFirst.mockResolvedValue(adminUser);
    prisma.usuario.findMany.mockResolvedValue([{ id: 1, nome: 'User 1', tipo: 'ADMIN', isAdmin: true, role: 'ADMIN' }]);

    const response = await request(app).get('/usuarios');

    expect(response.status).toBe(200);
  });
});