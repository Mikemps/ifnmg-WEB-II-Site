import express from 'express';
import * as editalController from '../controllers/editalController.js';
import validate from '../middlewares/validate.js';
import { createEditalSchema, updateEditalSchema, idEditalSchema, tituloEditalSchema } from '../schemas/editalSchema.js';

const router = express.Router();

// GET all editals
router.get('/', editalController.listarEditais);

// GET edital by ID
router.get('/:id', validate(idEditalSchema, 'params'), editalController.obterEditalPorId);

// GET edital by titulo
router.get('/titulo/:titulo', validate(tituloEditalSchema, 'params'), editalController.buscarEditalPorTitulo);

// POST create new edital
router.post('/', validate(createEditalSchema, 'body'), editalController.criarEdital);

// PUT update edital
router.put('/:id', validate(idEditalSchema, 'params'), validate(updateEditalSchema, 'body'), editalController.atualizarEdital);

// DELETE edital
router.delete('/:id', validate(idEditalSchema, 'params'), editalController.deletarEdital);

export default router;