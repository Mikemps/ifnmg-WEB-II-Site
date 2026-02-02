import express from 'express';
import * as loginController from '../controllers/loginController.js';
import validate from '../middlewares/validate.js';
import {
  loginSchema,
} from '../schemas/loginSchema.js';

const router = express.Router();
router.get('/', validate(loginSchema, 'body'), loginController.login);

export default router;