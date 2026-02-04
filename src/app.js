import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import uploadRotas from './routes/uploadRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import loginRotas from './routes/loginRotas.js';
import postagemRotas from './routes/postagemRotas.js';
import editalRotas from './routes/editalRotas.js';
import comentarioRotas from './routes/comentarioRotas.js';
import errorHandler from './middlewares/errorHandler.js';
import { multerErrorHandler } from './middlewares/multerErrorHandler.js';
import helmetConfig from './config/helmet.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(helmetConfig);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API do Gerador de Provas funcionando!',
    timestamp: new Date().toISOString(), // Nota: Nos testes, isso varia
    version: '1.0.0',
  });
});

// Rotas da Aplicação
app.use('/usuarios', usuarioRotas);
app.use('/login', loginRotas);
app.use('/postagens', postagemRotas);
app.use('/upload', uploadRotas);
app.use('/editais', editalRotas);
app.use('/comentarios', comentarioRotas);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    },
    path: req.path,
  });
});

app.use(multerErrorHandler);
app.use(errorHandler);

// Exportamos o app SEM dar o listen
export default app;

// ... (outros códigos)

// Middleware de tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    },
    timestamp: new Date().toISOString(), // <--- ADICIONE ESTA LINHA EXATAMENTE AQUI
    path: req.path,
  });
});

// ... (resto do código)