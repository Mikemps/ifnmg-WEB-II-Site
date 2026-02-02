import * as editalService from '../services/editalService.js';

export const criarEdital = async (req, res, next) => {
    try {
        const edital = await editalService.criarEdital(req.body);
        res.status(201).json({
            success: true,
            message: 'Edital criado com sucesso',
            data: edital,
        });
    } catch (error) {
        next(error);
    }
};

export const listarEditais = async (req, res, next) => {
    try {
        const editais = await editalService.listarEditais(req.query);
        res.status(200).json({
            success: true,
            data: editais,
        });
    } catch (error) {
        next(error);
    }
};

export const obterEditalPorId = async (req, res, next) => {
    try {
        const edital = await editalService.obterEditalPorId(parseInt(req.params.id));
        res.status(200).json({
            success: true,
            data: edital,
        });
    } catch (error) {
        next(error);
    }
};

export const atualizarEdital = async (req, res, next) => {
    try {
        const edital = await editalService.atualizarEdital(parseInt(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: 'Edital atualizado com sucesso',
            data: edital,
        });
    } catch (error) {
        next(error);
    }
};

export const deletarEdital = async (req, res, next) => {
    try {
        const resultado = await editalService.deletarEdital(parseInt(req.params.id));
        res.status(200).json({
            success: true,
            message: resultado.mensagem,
        });
    } catch (error) {
        next(error);
    }
};

export const buscarEditalPorTitulo = async (req, res, next) => {
    try {
        const editais = await editalService.buscarEditalPorTitulo(req.params.titulo);
        res.status(200).json({
            success: true,
            data: editais,
        });
    } catch (error) {
        next(error);
    }
};