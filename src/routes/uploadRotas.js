import express from 'express';
import upload from '../config/multer.js';

const router = express.Router();

// POST /upload/content-image
router.post('/content-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo inválido' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
