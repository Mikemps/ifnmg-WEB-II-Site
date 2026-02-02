import prisma from '../config/database.js';
import {
  AppError,
} from '../errors/AppError.js';

export const criarPostagem = async (data) => {
  const postagem = await prisma.postagem.create({
    data: {
      titulo: data.titulo,
      conteudo: data.conteudo,
      resumo: data.resumo,
      tipo: data.tipo,
      imagem_capa: data.imagem_capa || null,
      autorId: data.autorId,
    },
    include: {
      autor: {
        select: {
          idUsuario: true,
          nome: true,
          email: true,
        },
      },
    },
  });

  return postagem;
};

export const listarPostagens = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [postagens, total] = await Promise.all([
    prisma.postagem.findMany({
      skip,
      take: limit,
      include: {
        autor: {
          select: {
            idUsuario: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        data: 'desc',
      },
    }),
    prisma.postagem.count(),
  ]);

  return {
    postagens,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// (Removed obterPostagemPorId - not required for requested endpoints)

export const buscarPostagemPorTitulo = async (titulo, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [postagens, total] = await Promise.all([
    prisma.postagem.findMany({
      where: {
        titulo: {
          contains: titulo,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      include: {
        autor: {
          select: {
            idUsuario: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        data: 'desc',
      },
    }),
    prisma.postagem.count({
      where: {
        titulo: {
          contains: titulo,
          mode: 'insensitive',
        },
      },
    }),
  ]);

  if (postagens.length === 0) {
    throw new AppError('Nenhuma postagem encontrada com este título', 404);
  }

  return {
    postagens,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// (Removed atualizarPostagem - not required for requested endpoints)

export const deletarPostagem = async (id) => {
  const postagemExiste = await prisma.postagem.findUnique({
    where: { idPostagem: id },
  });

  if (!postagemExiste) {
    throw new AppError('Postagem não encontrada', 404);
  }

  // Deleta comentários associados (opcional, dependendo da política)
  await prisma.comentario.deleteMany({
    where: { postagemId: id },
  });

  // Deleta a postagem
  const postagem = await prisma.postagem.delete({
    where: { idPostagem: id },
  });

  return postagem;
};
