import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import validate from '../middlewares/validate.js';
import {
  createUserSchema,
} from '../schemas/usuarioSchema.js';

const router = express.Router();
router.post('/', validate(createUserSchema, 'body'), usuarioController.create);
router.get('/', usuarioController.getAll);
router.get('/email/', usuarioController.getByEmail);
router.put('/email/', usuarioController.updateByEmail);
router.delete('/email/', usuarioController.deleteByEmail);

export default router;