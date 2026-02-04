import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' sem importar (opcional)
    env: {
      // Definimos uma senha BEM LONGA para sumir com o aviso de segurança
      JWT_SECRET: 'minha-chave-secreta-super-longa-e-segura-para-testes-v2',
      PORT: '3000',
      NODE_ENV: 'test'
    },
  },
});