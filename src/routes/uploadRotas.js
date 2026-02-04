import express from 'express';
import upload from '../config/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/authorizationMiddleware.js';
import { put } from '@vercel/blob';

const router = express.Router();

// POST /upload/content-image (admin only)
// Importante: upload.single() DEVE vir antes da autenticação para processar o arquivo corretamente
router.post('/content-image', upload.single('image'), authMiddleware, requireAdmin, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo inválido' });

    // Gerar nome seguro para o arquivo
    const safeFilename = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '-');

    // Fazer upload para Vercel Blob
    const blob = await put(safeFilename, req.file.buffer, {
      access: 'public', // Torna o arquivo acessível publicamente
      contentType: req.file.mimetype,
    });

    // Retornar a URL do Blob
    res.json({ url: blob.url });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno no upload' });
  }
});

export default router;
