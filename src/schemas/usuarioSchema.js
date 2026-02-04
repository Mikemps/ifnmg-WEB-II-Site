import { z } from 'zod';

export const createUserSchema = z.object({
  nome: z
    .string({
      required_error: 'Nome é obrigatório',
      invalid_type_error: 'Nome deve ser um texto',
    })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  email: z
    .string({
      required_error: 'Email é obrigatório',
      invalid_type_error: 'Email deve ser um texto',
    })
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  senha: z
    .string({
      required_error: 'Senha é obrigatória',
      invalid_type_error: 'Senha deve ser um texto',
    })
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

export const updateUserSchema = z.object({
  nome: z
    .string({
      invalid_type_error: 'Nome deve ser um texto',
    })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  senha: z
    .string({
      invalid_type_error: 'Senha deve ser um texto',
    })
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .optional(),

  perfilId: z
    .number({
      invalid_type_error: 'Perfil ID deve ser um número',
    })
    .int('Perfil ID deve ser um número inteiro')
    .optional(),
}).strict();
