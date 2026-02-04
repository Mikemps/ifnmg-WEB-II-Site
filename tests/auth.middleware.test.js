import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// --- CORREÇÃO DO MOCK AQUI ---
// O erro reclamou que "criarPostagem" não estava definido.
// Adicionamos as funções vazias para o Controller conseguir carregar sem quebrar.
vi.mock('../src/services/postagemService.js', () => ({
  criarPostagem: vi.fn(),
  listarPostagens: vi.fn(),
  buscarPostagemPorTipo: vi.fn(),
  // Adicione outras se o erro pedir
}));

vi.mock('../src/config/database.js', () => ({ default: {} }));

describe('Middleware de Autenticação', () => {
  
  // Payload válido para passar pela validação e testar apenas o Auth
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

    // Se der erro 500 de novo, o console vai nos mostrar o motivo
    if (response.status === 500) {
      console.log('ERRO INTERNO NO AUTH:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBeOneOf([401, 403]);
  });

  it('Deve negar acesso com token inválido', async () => {
    const response = await request(app)
      .post('/postagens')
      .set('Authorization', 'Bearer token_falso_123')
      .send(payloadValido);

    expect(response.status).toBeOneOf([401, 403]);
  });
});