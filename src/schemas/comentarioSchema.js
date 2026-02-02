import { z } from 'zod';

export const comentarioCreateSchema = z.object({
  texto: z
    .string({
      required_error: 'Texto do comentário é obrigatório',
      invalid_type_error: 'Texto deve ser um texto',
    })
    .min(1, 'Comentário não pode ser vazio')
    .max(2000, 'Comentário muito longo')
    .trim(),

  usuarioId: z.preprocess((val) => {
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isNaN(n) ? val : n;
    }
    return val;
  }, z.number({
    required_error: 'Usuario ID é obrigatório',
    invalid_type_error: 'Usuario ID deve ser um número',
  }).int('Usuario ID deve ser um número inteiro')),

  postagemId: z.preprocess((val) => {
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isNaN(n) ? val : n;
    }
    return val;
  }, z.number({
    required_error: 'Postagem ID é obrigatório',
    invalid_type_error: 'Postagem ID deve ser um número',
  }).int('Postagem ID deve ser um número inteiro')),
});

export const comentarioUpdateSchema = z.object({
  texto: z
    .string({
      required_error: 'Texto do comentário é obrigatório',
      invalid_type_error: 'Texto deve ser um texto',
    })
    .min(1, 'Comentário não pode ser vazio')
    .max(2000, 'Comentário muito longo')
    .trim(),
});
