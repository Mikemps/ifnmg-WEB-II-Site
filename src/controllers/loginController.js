import * as loginService from '../services/loginService.js';

export const login = async (req, res, next) => {
    try{
        const usuario = await loginService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login feito com sucesso',
            data: usuario,
        });
    } catch (error) {
        next(error);
    }
};