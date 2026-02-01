import * as usuarioService from '../services/usuarioService.js';

export const create = async (req, res, next) => {
    try{
        const usuario = await usuarioService.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: usuario,
        });
    } catch (error) {
        next(error);
    }
};