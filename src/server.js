// src/server.js
import express from 'express';
import usuarioRotas from './routes/usuarioRotas.js';
import loginRotas from './routes/loginRotas.js';
import editalRotas from './routes/editalRotas.js';
//import prisma from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import helmetConfig from './config/helmet.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmetConfig);
// Middleware para parsing JSON
app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => {

  res.status(200).json({
    status: 'OK',
    message: 'API do Gerador de Provas funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  
});

app.use('/usuarios', usuarioRotas);
app.use('/login', loginRotas);
app.use('/editais', editalRotas);

// Middleware de tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

app.use(errorHandler);

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Usuários: http://localhost:${PORT}/users`);
});