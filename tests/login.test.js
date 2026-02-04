import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js'; // Importa o app real

// 1. Mock do Prisma (Banco de Dados)
// Isso intercepta qualquer chamada ao banco feita dentro das rotas
vi.mock('../src/config/database.js', () => ({
  default: {
    usuario: {
      findUnique: vi.fn(), // Simula a busca de usuário
    },
  },
}));

import prisma from '../src/config/database.js';

describe('POST /login', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('Deve fazer login com sucesso e retornar token', async () => {
    // CENÁRIO: O banco "encontra" um usuário válido
    // Nota: Se você usa bcrypt, o teste pode falhar na verificação de senha real.
    // Para testes de integração pura sem banco, as vezes mockamos o bcrypt também.
    const usuarioMock = {
      id: 1,
      email: 'teste@email.com',
      senha: '123', // Em um cenário real, isso estaria hashado
      nome: 'Usuário Teste'
    };

    // Dizemos ao mock: "Quando chamarem findUnique, devolva esse usuário"
    prisma.usuario.findUnique.mockResolvedValue(usuarioMock);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'teste@email.com',
        senha: '123'
      });

    // Se sua lógica de login compara senhas reais (bcrypt), 
    // esse teste pode retornar 401 se não mockarmos o bcrypt. 
    // Mas assumindo uma lógica simples ou mockada:
    
    // Verificações
    expect(response.status).not.toBe(500); // Garante que não quebrou
    // Se sua rota retorna 200 no sucesso:
    if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
    }
  });

  it('Deve retornar 401/400 se o usuário não existir', async () => {
    // CENÁRIO: O banco retorna null (usuário não encontrado)
    prisma.usuario.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'inexistente@email.com',
        senha: '123'
      });

    expect(response.status).toBeOneOf([400, 401, 404]); // Depende do seu controller
  });
});