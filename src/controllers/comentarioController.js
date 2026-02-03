import * as comentarioService from '../services/comentarioService.js';
import { AppError } from '../errors/AppError.js';
import prisma from '../config/database.js';

export const criar = async (req, res, next) => {
  try {
    const dados = {
      ...req.body,
      usuarioId: req.user.id,
    };

    const comentario = await comentarioService.criarComentario(dados);

    res.status(201).json({
      success: true,
      message: 'Comentário criado com sucesso',
      data: comentario,
    });
  } catch (error) {
    next(error);
  }
};

export const deletar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar proprietário
    const comentario = await prisma.comentario.findUnique({
      where: { idComentario: parseInt(id) },
    });

    if (!comentario) {
      throw new AppError('Comentário não encontrado', 404, 'NOT_FOUND');
    }

    // Verificar se é proprietário ou admin
    const isOwner = comentario.usuarioId === req.user.id;
    const isAdmin = req.user.nomePerfil === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new AppError(
        'Você só pode deletar seus próprios comentários',
        403,
        'INSUFFICIENT_PERMISSIONS'
      );
    }

    await comentarioService.deletarComentario(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Comentário deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

export const editar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar proprietário
    const comentario = await prisma.comentario.findUnique({
      where: { idComentario: parseInt(id) },
    });

    if (!comentario) {
      throw new AppError('Comentário não encontrado', 404, 'NOT_FOUND');
    }

    // Verificar se é proprietário ou admin
    const isOwner = comentario.usuarioId === req.user.id;
    const isAdmin = req.user.nomePerfil === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new AppError(
        'Você só pode editar seus próprios comentários',
        403,
        'INSUFFICIENT_PERMISSIONS'
      );
    }

    const atualizado = await comentarioService.atualizarComentario(parseInt(id), req.body);

    res.status(200).json({
      success: true,
      message: 'Comentário atualizado com sucesso',
      data: atualizado,
    });
  } catch (error) {
    next(error);
  }
};
