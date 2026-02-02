import express from 'express';
import * as comentarioController from '../controllers/comentarioController.js';
import validate from '../middlewares/validate.js';
import { comentarioCreateSchema, comentarioUpdateSchema } from '../schemas/comentarioSchema.js';

const router = express.Router();

// POST /comentarios - criar comentário
router.post('/', validate(comentarioCreateSchema, 'body'), comentarioController.criar);

// PATCH /comentarios/:id - atualizar comentário
router.patch('/:id', validate(comentarioUpdateSchema, 'body'), comentarioController.editar);

// DELETE /comentarios/:id - deletar comentário
router.delete('/:id', comentarioController.deletar);

export default router;
