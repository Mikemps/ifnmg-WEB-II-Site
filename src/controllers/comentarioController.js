import * as comentarioService from '../services/comentarioService.js';

export const criar = async (req, res, next) => {
  try {
    const dados = req.body;

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
