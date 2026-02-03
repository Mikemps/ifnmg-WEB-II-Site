import { verifyToken } from '../config/jwt.js';
import { AppError } from '../errors/AppError.js';

/**
 * Middleware para autenticar requisições usando JWT
 * Espera o token no header Authorization: Bearer <token>
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Token não fornecido ou formato inválido',
        401,
        'MISSING_TOKEN'
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    const decoded = verifyToken(token);

    // Adicionar informações do usuário ao objeto de requisição
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      perfilId: decoded.perfilId,
      nomePerfil: decoded.nomePerfil,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expirado', 401, 'TOKEN_EXPIRED'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError('Token inválido', 401, 'INVALID_TOKEN'));
    } else {
      next(new AppError('Erro ao autenticar', 401, 'AUTH_ERROR'));
    }
  }
};

/**
 * Middleware para autenticação opcional
 * Se houver token válido, adiciona ao req.user, caso contrário continua sem erro
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      req.user = {
        id: decoded.sub,
        email: decoded.email,
        perfilId: decoded.perfilId,
        nomePerfil: decoded.nomePerfil,
      };
    }

    next();
  } catch (error) {
    // Ignora erros de autenticação em middleware opcional
    next();
  }
};

export default authMiddleware;
