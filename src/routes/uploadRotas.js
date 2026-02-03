import express from 'express';
import upload from '../config/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// POST /upload/content-image (admin only)
// Importante: upload.single() DEVE vir antes da autenticação para processar o arquivo corretamente
router.post('/content-image', upload.single('image'), authMiddleware, requireAdmin, (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo inválido' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
