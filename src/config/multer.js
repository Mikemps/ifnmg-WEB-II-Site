import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|gif)$/i;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safe);
  }
});

const fileFilter = (req, file, cb) => {
  // Valida MIME type
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}. Aceitos: JPEG, JPG, PNG, GIF`), false);
  }

  // Valida extensão do arquivo
  if (!ALLOWED_EXTENSIONS.test(file.originalname)) {
    return cb(new Error(`Extensão de arquivo não permitida: ${path.extname(file.originalname)}`), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // Máximo 1 arquivo por vez
  },
});

export default upload;
