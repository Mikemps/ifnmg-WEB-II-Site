import { z } from 'zod';

export const createEditalSchema = z.object({
    titulo: z
        .string({
            required_error: 'Título é obrigatório',
            invalid_type_error: 'Título deve ser um texto',
        })
        .min(1, 'Título deve ter pelo menos 1 caractere')
        .trim(),

    tipo: z
        .string({
            required_error: 'Tipo é obrigatório',
            invalid_type_error: 'Tipo deve ser um texto',
        })
        .min(1, 'Tipo deve ter pelo menos 1 caractere')
        .trim(),

    editalurl: z
        .string({
            required_error: 'URL do edital é obrigatória',
            invalid_type_error: 'URL do edital deve ser um texto',
        })
        .min(1, 'URL do edital deve ter pelo menos 1 caractere')
        .trim(),

    data_publicacao: z.preprocess((val) => typeof val === 'string' ? new Date(val) : val, z.date()).optional(),
    data_validade: z.preprocess((val) => typeof val === 'string' ? new Date(val) : val, z.date()),

    autorId: z
        .number({
            required_error: 'ID do autor é obrigatório',
            invalid_type_error: 'ID do autor deve ser um número',
        })
        .int('ID do autor deve ser um número inteiro'),
}).strict().refine(
    (data) => !data.data_publicacao || data.data_validade > data.data_publicacao,
    {
        message: "data_validade must be greater than data_publicacao",
        path: ["data_validade"],
    }
);

export const updateEditalSchema = z.object({
    titulo: z.string().trim().min(1).optional(),
    tipo: z.string().trim().min(1).optional(),
    editalurl: z.string().trim().min(1).optional(),
    data_publicacao: z.preprocess((val) => typeof val === 'string' ? new Date(val) : val, z.date()).optional(),
    data_validade: z.preprocess((val) => typeof val === 'string' ? new Date(val) : val, z.date()).optional(),
    autorId: z.number().int().optional(),
}).strict().refine(
    (data) => !data.data_validade || !data.data_publicacao || data.data_validade > data.data_publicacao,
    {
        message: "data_validade must be greater than data_publicacao",
        path: ["data_validade"],
    }
);

export const idEditalSchema = z.object({
    id: z.preprocess((val) => typeof val === 'string' ? parseInt(val, 10) : val, z.number().int()),
});

export const tituloEditalSchema = z.object({
    titulo: z.string().trim().min(3, 'Título deve ter pelo menos 3 caracteres'),
});