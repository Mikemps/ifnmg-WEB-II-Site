import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import validate from '../middlewares/validate.js';
import {
  createUserSchema,
} from '../schemas/usuarioSchema.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// POST /usuarios - criar usuário (público)
router.post('/', validate(createUserSchema, 'body'), usuarioController.create);

// GET /usuarios - listar todos (admin only)
router.get('/', authMiddleware, requireAdmin, usuarioController.getAll);

// GET /usuarios/email - obter usuário por email (autenticado - seu próprio ou admin)
router.get('/email/', authMiddleware, usuarioController.getByEmail);

// PUT /usuarios/email - atualizar usuário por email (autenticado - seu próprio ou admin para perfil)
router.put('/email/', authMiddleware, usuarioController.updateByEmail);

// DELETE /usuarios/email - deletar usuário por email (autenticado - seu próprio ou admin)
router.delete('/email/', authMiddleware, usuarioController.deleteByEmail);

export default router;