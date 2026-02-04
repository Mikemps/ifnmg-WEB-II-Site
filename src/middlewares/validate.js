import { ValidationError } from '../errors/AppError.js';

/**
 * Middleware factory para validação com Zod
 * Cria um middleware que valida dados contra um schema Zod
 * 
 * @param {Object} schema - Schema Zod para validação
 * @param {string} source - De onde vem os dados ('body', 'params', 'query')
 * @returns {Function} Middleware Express
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];

      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const details = result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        throw new ValidationError('Dados de entrada inválidos', details);
      }

      req[source] = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;