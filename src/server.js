// src/server.js
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import uploadRotas from './routes/uploadRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import loginRotas from './routes/loginRotas.js';
import postagemRotas from './routes/postagemRotas.js';
import editalRotas from './routes/editalRotas.js';
import comentarioRotas from './routes/comentarioRotas.js';
import prisma from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import { multerErrorHandler } from './middlewares/multerErrorHandler.js';
import helmetConfig from './config/helmet.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(helmetConfig);
// Middleware para parsing JSON
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
app.use('/postagens', postagemRotas);
app.use('/upload', uploadRotas);
app.use('/editais', editalRotas);
app.use('/comentarios', comentarioRotas);

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


// Middleware de tratamento de erros do multer
app.use(multerErrorHandler);

app.use(errorHandler);

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Usuários: http://localhost:${PORT}/users`);
});