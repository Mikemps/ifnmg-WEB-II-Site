import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import validate from '../middlewares/validate.js';
import {
  createUserSchema,
} from '../schemas/usuarioSchema.js';

const router = express.Router();
router.post('/', validate(createUserSchema, 'body'), usuarioController.create);

export default router;