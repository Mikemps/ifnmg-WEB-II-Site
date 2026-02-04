import express from 'express';
import * as postagemController from '../controllers/postagemController.js';
import upload from '../config/multer.js';
import validate from '../middlewares/validate.js';
import { postagemCreateSchema } from '../schemas/postagemSchema.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// POST /postagens - criar postagem (admin only)
// Note: upload must run before validate so files are parsed into req.body/req.file
router.post('/', authMiddleware, requireAdmin, upload.single('imagem_capa'), validate(postagemCreateSchema, 'body'), postagemController.criar);

// GET /postagens - listar postagens com paginação (público)
router.get('/', postagemController.listar);

// GET /postagens/buscar/:titulo - buscar postagens por título (público)
router.get('/buscar/:titulo', postagemController.buscarPorTitulo);

// GET /postagens/tipo/:tipo - buscar postagens por tipo (post ou servico) (público)
router.get('/tipo/:tipo', postagemController.buscarPorTipo);

// GET /postagens/:id/comentarios - listar comentários da postagem (ANTES de /:id) (público)
router.get('/:id/comentarios', postagemController.listarComentarios);

// DELETE /postagens/:id - deletar postagem (admin only)
router.delete('/:id', authMiddleware, requireAdmin, postagemController.deletar);

export default router;
