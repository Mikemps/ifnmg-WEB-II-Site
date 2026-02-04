// 1. Imports de Bibliotecas
import 'dotenv/config.js';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import prisma from './config/database.js';


// 2. Imports de Configurações e Middlewares
import helmetConfig from './config/helmet.js';
import errorHandler from './middlewares/errorHandler.js';
import { multerErrorHandler } from './middlewares/multerErrorHandler.js';
// Import dummy para garantir inclusão no bundle do Vercel
import { AppError } from './errors/appError.js';

// 3. Imports de Rotas
import uploadRotas from './routes/uploadRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import loginRotas from './routes/loginRotas.js';
import postagemRotas from './routes/postagemRotas.js';
import editalRotas from './routes/editalRotas.js';
import comentarioRotas from './routes/comentarioRotas.js';

// 4. Configurações Iniciais
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 5. Middlewares Globais
app.use(helmetConfig);
app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- 6. CONFIGURAÇÃO DINÂMICA DO SWAGGER ---
// Isso garante que qualquer mudança no swagger.yaml apareça ao dar F5
app.use('/api-docs', swaggerUi.serve, (req, res) => {
  try {
    const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.yaml');
    const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));
    swaggerUi.setup(swaggerDocument)(req, res);
  } catch (e) {
    res.status(500).send("Erro ao carregar a documentação: " + e.message);
  }
});

// 7. Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API do Site SIFSoft Funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 8. Definição das Rotas da API
app.use('/usuarios', usuarioRotas);
app.use('/login', loginRotas);
app.use('/postagens', postagemRotas);
app.use('/upload', uploadRotas);
app.use('/editais', editalRotas);
app.use('/comentarios', comentarioRotas);

// 9. Middleware para Rotas Não Encontradas (404)
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

// 10. Tratamento de Erros
app.use(multerErrorHandler);
app.use(errorHandler);

// Exportar o app para testes
export default app;

// 11. Seed de Perfis
const seedPerfis = async () => {
  if (process.env.NODE_ENV === 'test') return; // Não rodar seed em testes
  try {
    const perfisExistentes = await prisma.perfil.count();
    if (perfisExistentes === 0) {
      await prisma.perfil.createMany({
        data: [
          { idPerfil: 1, nome_perfil: 'USER' },
          { idPerfil: 2, nome_perfil: 'ADMIN' },
        ],
      });
      console.log('Perfis criados: USER (1) e ADMIN (2)');
    }
  } catch (error) {
    console.error('Erro ao criar perfis:', error);
  }
};

// 12. Inicialização do Servidor
const startServer = async () => {
  await seedPerfis();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
  });
};

startServer();