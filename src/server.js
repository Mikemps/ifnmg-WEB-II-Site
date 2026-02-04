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

// Servir arquivos estáticos da raiz (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Servir index.html na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// CORS: permitir requisições da UI Swagger de qualquer origem (incluindo deployments preview)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- 6. CONFIGURAÇÃO DO SWAGGER ---
// Serve estático de `public/api-docs` (gerado em build) e fallback para
// `node_modules/swagger-ui-dist` para garantir que os assets existam em runtime.
const publicSwaggerPath = path.join(__dirname, '..', 'public', 'api-docs');
const distSwaggerPath = path.join(__dirname, '..', 'node_modules', 'swagger-ui-dist');

// Primeiro tenta servir arquivos estáticos gerados em `public/api-docs`
if (fs.existsSync(publicSwaggerPath)) {
  app.use('/api-docs', express.static(publicSwaggerPath));
}

// Fallback para os arquivos do pacote `swagger-ui-dist`
if (fs.existsSync(distSwaggerPath)) {
  app.use('/api-docs', express.static(distSwaggerPath));
}

// Carrega o swagger.yaml na inicialização e monta o middleware padrão
try {
  const swaggerPathInit = path.join(__dirname, '..', 'docs', 'swagger.yaml');
  const swaggerDocumentInit = yaml.load(fs.readFileSync(swaggerPathInit, 'utf8'));

  if (process.env.VERCEL_URL) {
    swaggerDocumentInit.servers = [
      { url: `https://${process.env.VERCEL_URL}`, description: 'API em Produção (Vercel)' },
      { url: 'http://localhost:3000', description: 'API Local' },
    ];
  }

  // Forçar uso de assets no CDN (evita buscar arquivos em node_modules/public no Vercel)
  const swaggerUiOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'
    ],
    customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }'
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentInit, swaggerUiOptions));
} catch (e) {
  console.warn('Não foi possível carregar swagger.yaml na inicialização:', e.message);
}

// Servir o arquivo swagger.yaml via endpoint para garantir mesmo-origin e MIME correto
app.get('/api-docs/swagger.yaml', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'docs', 'swagger.yaml');
    res.type('application/x-yaml');
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send('Erro ao servir swagger.yaml');
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