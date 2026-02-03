import { z } from 'zod';

export const postagemCreateSchema = z.object({
  titulo: z
    .string({
      required_error: 'Título é obrigatório',
      invalid_type_error: 'Título deve ser um texto',
    })
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .trim(),

  conteudo: z
    .string({
      required_error: 'Conteúdo é obrigatório',
      invalid_type_error: 'Conteúdo deve ser um texto',
    })
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(50000, 'Conteúdo deve ter no máximo 50000 caracteres')
    .trim(),

  resumo: z
    .string({
      required_error: 'Resumo é obrigatório',
      invalid_type_error: 'Resumo deve ser um texto',
    })
    .min(10, 'Resumo deve ter pelo menos 10 caracteres')
    .max(500, 'Resumo deve ter no máximo 500 caracteres')
    .trim(),

  tipo: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        let cleaned = val.trim().toLowerCase();
        // Remove aspas literais se existirem
        cleaned = cleaned.replace(/^"|"$/g, '');
        return cleaned;
      }
      return val;
    }, z.enum(['post', 'servico'], {
      errorMap: () => ({ message: 'Tipo deve ser "post" ou "servico"' }),
    })),

  imagem_capa: z
    .string({
      invalid_type_error: 'Imagem de capa deve ser um texto (URL)',
    })
    .optional(),
});

export const postagemUpdateSchema = z.object({
  titulo: z
    .string({
      invalid_type_error: 'Título deve ser um texto',
    })
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .trim()
    .optional(),

  conteudo: z
    .string({
      invalid_type_error: 'Conteúdo deve ser um texto',
    })
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(50000, 'Conteúdo deve ter no máximo 50000 caracteres')
    .trim()
    .optional(),

  resumo: z
    .string({
      invalid_type_error: 'Resumo deve ser um texto',
    })
    .min(10, 'Resumo deve ter pelo menos 10 caracteres')
    .max(500, 'Resumo deve ter no máximo 500 caracteres')
    .trim()
    .optional(),

  tipo: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        let cleaned = val.trim().toLowerCase();
        // Remove aspas literais se existirem
        cleaned = cleaned.replace(/^"|"$/g, '');
        return cleaned;
      }
      return val;
    }, z.enum(['post', 'servico'], {
      errorMap: () => ({ message: 'Tipo deve ser "post" ou "servico"' }),
    }))
    .optional(),

  imagem_capa: z
    .string({
      invalid_type_error: 'Imagem de capa deve ser um texto (URL)',
    })
    .optional(),
});
