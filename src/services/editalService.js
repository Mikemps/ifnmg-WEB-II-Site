import prisma from '../config/database.js';
import {
  AppError,
} from '../errors/AppError.js';

export const criarEdital = async (dados) => {
    // Verificar se já existe um edital com a mesma URL ou título
    const editalExistente = await prisma.edital.findFirst({
        where: {
            OR: [
                { editalurl: dados.editalurl },
                { titulo: dados.titulo },
            ],
        },
    });

    if (editalExistente) {
        throw new AppError("Edital com este título ou URL já existe", 409);
    }

    const edital = await prisma.edital.create({
        data: dados,
        include: {
            autor: {
                select: {
                    nome: true,
                },
            },
        },
    });

    return edital;
};

export const listarEditais = async (filtros = {}) => {
    const editais = await prisma.edital.findMany({
        where: filtros,
        orderBy: { data_publicacao: "desc" },
        include: {
            autor: {
                select: {
                    nome: true,
                },
            },
        },
    });

    return editais;
};

export const obterEditalPorId = async (id) => {
    const edital = await prisma.edital.findUnique({
        where: { idEdital: id },
        include: {
            autor: {
                select: {
                    nome: true,
                },
            },
        },
    });

    if (!edital) {
        throw new AppError("Edital não encontrado", 404);
    }

    return edital;
};

export const atualizarEdital = async (id, dados) => {
    await obterEditalPorId(id);

    // Verificar se já existe outro edital com o mesmo título ou URL
    if (dados.titulo || dados.editalurl) {
        const editalExistente = await prisma.edital.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            dados.titulo ? { titulo: dados.titulo } : {},
                            dados.editalurl ? { editalurl: dados.editalurl } : {},
                        ].filter(obj => Object.keys(obj).length > 0),
                    },
                    { idEdital: { not: id } },
                ],
            },
        });

        if (editalExistente) {
            throw new AppError("Já existe outro edital com este título ou URL", 409);
        }
    }

    const editalAtualizado = await prisma.edital.update({
        where: { idEdital: id },
        data: dados,
        include: {
            autor: {
                select: {
                    nome: true,
                },
            },
        },
    });

    return editalAtualizado;
};

export const deletarEdital = async (id) => {
    await obterEditalPorId(id);

    await prisma.edital.delete({
        where: { idEdital: id },
    });

    return { mensagem: "Edital deletado com sucesso" };
};

export const buscarEditalPorTitulo = async (titulo) => {
    const editais = await prisma.edital.findMany({
        where: {
            titulo: {
                contains: titulo,
                mode: 'insensitive',
            },
        },
        include: {
            autor: {
                select: {
                    nome: true,
                },
            },
        },
        orderBy: { data_publicacao: "desc" },
    });

    if (editais.length === 0) {
        throw new AppError("Nenhum edital encontrado com esse título", 404);
    }

    return editais;
};
