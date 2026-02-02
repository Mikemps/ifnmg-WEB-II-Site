import multer from 'multer';

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Arquivo muito grande. Máximo permitido: 5MB',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Campo de arquivo inesperado',
      });
    }
    if (err.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Número de partes do formulário excedido',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Número de arquivos excedido',
      });
    }
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        error: 'Arquivo excede o tamanho máximo de 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Erro ao processar arquivo: ${err.message}`,
    });
  }

  // Erro de tipo de arquivo não permitido
  if (err.message && err.message.includes('arquivo')) {
    return res.status(400).json({
      success: false,
      error: 'Tipo de arquivo não permitido. Aceitos: JPEG, JPG, PNG, GIF',
    });
  }

  next(err);
};
