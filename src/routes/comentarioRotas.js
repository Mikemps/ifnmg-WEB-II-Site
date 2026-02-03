import express from 'express';
import * as comentarioController from '../controllers/comentarioController.js';
import validate from '../middlewares/validate.js';
import { comentarioCreateSchema, comentarioUpdateSchema } from '../schemas/comentarioSchema.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /comentarios - criar comentário (autenticado)
router.post('/', authMiddleware, validate(comentarioCreateSchema, 'body'), comentarioController.criar);

// PATCH /comentarios/:id - atualizar comentário (owner ou admin)
router.patch('/:id', authMiddleware, validate(comentarioUpdateSchema, 'body'), comentarioController.editar);

// DELETE /comentarios/:id - deletar comentário (owner ou admin)
router.delete('/:id', authMiddleware, comentarioController.deletar);

export default router;
