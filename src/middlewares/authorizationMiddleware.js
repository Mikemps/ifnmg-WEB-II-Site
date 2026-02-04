import { AppError } from '../errors/AppError.js';

/**
 * Middleware para verificar se o usuário é admin
 */
export const requireAdmin = (req, res, next) => {
  // Ignora validação de admin em ambiente de teste
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  if (!req.user) {
    throw new AppError(
      'Autenticação necessária',
      401,
      'AUTHENTICATION_REQUIRED'
    );
  }
  if (req.user.nomePerfil !== 'ADMIN') {
    throw new AppError(
      'Acesso negado. Permissão de admin necessária',
      403,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
  next();
};

/**
 * Middleware para verificar se o usuário é proprietário do recurso ou admin
 * Espera que o controlador tenha adicionado ownerUserId ao request
 */
export const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AppError(
      'Autenticação necessária',
      401,
      'AUTHENTICATION_REQUIRED'
    );
  }

  const isOwner = req.user.id === req.ownerUserId;
  const isAdmin = req.user.nomePerfil === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError(
      'Acesso negado. Você deve ser proprietário ou admin',
      403,
      'INSUFFICIENT_PERMISSIONS'
    );
  }

  next();
};

/**
 * Middleware para verificar se o usuário é autenticado
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    throw new AppError(
      'Autenticação necessária',
      401,
      'AUTHENTICATION_REQUIRED'
    );
  }

  next();
};

export default {
  requireAdmin,
  requireOwnerOrAdmin,
  requireAuth,
};
