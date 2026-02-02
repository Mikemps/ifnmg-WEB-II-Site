import prisma from '../config/database.js';
import { NotFoundError } from '../errors/AppError.js';

export const criarComentario = async (data) => {
  const [usuario, postagem] = await Promise.all([
    prisma.usuario.findUnique({ where: { idUsuario: data.usuarioId } }),
    prisma.postagem.findUnique({ where: { idPostagem: data.postagemId } }),
  ]);

  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  if (!postagem) {
    throw new NotFoundError('Postagem não encontrada');
  }

  const comentario = await prisma.comentario.create({
    data: {
      texto: data.texto,
      usuarioId: data.usuarioId,
      postagemId: data.postagemId,
    },
    include: {
      usuario: {
        select: {
          idUsuario: true,
          nome: true,
        },
      },
    },
  });

  return comentario;
};

export const deletarComentario = async (id) => {
  const comentario = await prisma.comentario.findUnique({ where: { idComentario: id } });

  if (!comentario) {
    throw new NotFoundError('Comentário não encontrado');
  }

  await prisma.comentario.delete({ where: { idComentario: id } });

  return;
};

export const atualizarComentario = async (id, data) => {
  const comentario = await prisma.comentario.findUnique({ where: { idComentario: id } });

  if (!comentario) {
    throw new NotFoundError('Comentário não encontrado');
  }

  const atualizado = await prisma.comentario.update({
    where: { idComentario: id },
    data: {
      texto: data.texto || comentario.texto,
    },
    include: {
      usuario: {
        select: { idUsuario: true, nome: true },
      },
    },
  });

  return atualizado;
};

export default {
  criarComentario,
};
