import express from 'express';
import * as editalController from '../controllers/editalController.js';
import validate from '../middlewares/validate.js';
import { createEditalSchema, updateEditalSchema, idEditalSchema, tituloEditalSchema } from '../schemas/editalSchema.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// GET all editals (público)
router.get('/', editalController.listarEditais);

// GET edital by ID (público)
router.get('/:id', validate(idEditalSchema, 'params'), editalController.obterEditalPorId);

// GET edital by titulo (público)
router.get('/titulo/:titulo', validate(tituloEditalSchema, 'params'), editalController.buscarEditalPorTitulo);

// POST create new edital (admin only)
router.post('/', authMiddleware, requireAdmin, validate(createEditalSchema, 'body'), editalController.criarEdital);

// PUT update edital (admin only)
router.put('/:id', authMiddleware, requireAdmin, validate(idEditalSchema, 'params'), validate(updateEditalSchema, 'body'), editalController.atualizarEdital);

// DELETE edital (admin only)
router.delete('/:id', authMiddleware, requireAdmin, validate(idEditalSchema, 'params'), editalController.deletarEdital);

export default router;