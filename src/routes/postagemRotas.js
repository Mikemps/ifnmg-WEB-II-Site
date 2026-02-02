import express from 'express';
import * as postagemController from '../controllers/postagemController.js';
import upload from '../config/multer.js';
import validate from '../middlewares/validate.js';
import { postagemCreateSchema } from '../schemas/postagemSchema.js';

const router = express.Router();

// POST /postagens - criar postagem com upload de imagem_capa
// Note: upload must run before validate so files are parsed into req.body/req.file
router.post('/', upload.single('imagem_capa'), validate(postagemCreateSchema, 'body'), postagemController.criar);

// GET /postagens - listar postagens com paginação
router.get('/', postagemController.listar);

// GET /postagens/buscar/:titulo - buscar postagens por título
router.get('/buscar/:titulo', postagemController.buscarPorTitulo);

// DELETE /postagens/:id - deletar postagem
router.delete('/:id', postagemController.deletar);

export default router;
