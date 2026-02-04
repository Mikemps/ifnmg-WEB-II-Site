import * as postagemService from '../services/postagemService.js';
import { AppError } from '../errors/appError.js';

export const listarComentarios = async (req, res, next) => {
  try {
    const postagemId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const resultado = await postagemService.listarComentariosDaPostagem(postagemId, page, limit);

    res.status(200).json({
      success: true,
      message: 'Comentários listados com sucesso',
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const criar = async (req, res, next) => {
  try {
    // `validate` middleware already validated and replaced `req.body`
    const dados = {
      ...req.body,
      autorId: req.user.id,
      ...(req.file && { imagem_capa: `/uploads/${req.file.filename}` }),
    };

    const postagem = await postagemService.criarPostagem(dados);

    res.status(201).json({
      success: true,
      message: 'Postagem criada com sucesso',
      data: postagem,
    });
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resultado = await postagemService.listarPostagens(page, limit);

    res.status(200).json({
      success: true,
      message: 'Postagens listadas com sucesso',
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const buscarPorTitulo = async (req, res, next) => {
  try {
    const { titulo } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resultado = await postagemService.buscarPostagemPorTitulo(titulo, page, limit);

    res.status(200).json({
      success: true,
      message: 'Postagens encontradas com sucesso',
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const buscarPorTipo = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resultado = await postagemService.buscarPostagemPorTipo(tipo, page, limit);

    res.status(200).json({
      success: true,
      message: `Postagens do tipo "${tipo}" encontradas com sucesso`,
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

export const deletar = async (req, res, next) => {
  try {
    const { id } = req.params;

    await postagemService.deletarPostagem(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Postagem deletada com sucesso',
    });
  } catch (error) {
    next(error);
  }
};
