import * as usuarioService from '../services/usuarioService.js';
import { AppError } from '../errors/appError.js';


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

export const getAll = async (req, res, next) => {
    try{
        const usuarios = await usuarioService.getAllUsuario(req.body);
        res.status(200).json({
        success: true,
        data: usuarios,
        total: usuarios.length,
        });
    } catch (error) {
        next(error);
    }
}

export const getByEmail = async (req, res, next) =>{
    try{
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email é obrigatório'
        });
    }

    // Verificar se é seu próprio email ou se é admin
    const isAdmin = req.user.nomePerfil === 'ADMIN';
    const isOwnEmail = req.user.email === email;

    if (!isOwnEmail && !isAdmin) {
        throw new AppError(
            'Você só pode consultar seus próprios dados',
            403,
            'INSUFFICIENT_PERMISSIONS'
        );
    }

    const usuario = await usuarioService.getUsuarioByEmail(email);
    if(!usuario){
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
        
    res.status(200).json({
        success: true,
        data: usuario,
    });
}   catch(error) {
    next(error);
    }
};

export const updateByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
      });
    }

    // Verificar se é seu próprio email ou se é admin
    const isAdmin = req.user.nomePerfil === 'ADMIN';
    const isOwnEmail = req.user.email === email;

    if (!isOwnEmail && !isAdmin) {
        throw new AppError(
            'Você só pode atualizar seus próprios dados',
            403,
            'INSUFFICIENT_PERMISSIONS'
        );
    }

    // Verificar se está tentando alterar o perfil
    if (req.body.perfilId !== undefined && !isAdmin) {
        throw new AppError(
            'Apenas admin pode alterar o perfil do usuário',
            403,
            'INSUFFICIENT_PERMISSIONS'
        );
    }

    const usuario = await usuarioService.updateUsuarioByEmail(
      email,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: usuario,
    });
  } catch (error) {
    console.error('ERRO UPDATE USUARIO:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    next(error);
  }
};

export const deleteByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
      });
    }

    // Verificar se é seu próprio email ou se é admin
    const isAdmin = req.user.nomePerfil === 'ADMIN';
    const isOwnEmail = req.user.email === email;

    if (!isOwnEmail && !isAdmin) {
        throw new AppError(
            'Você só pode deletar sua própria conta',
            403,
            'INSUFFICIENT_PERMISSIONS'
        );
    }

    const usuario = await usuarioService.deleteUsuarioByEmail(email);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuário excluído com sucesso',
      data: usuario,
    });
  } catch (error) {
    console.error('ERRO DELETE USUARIO:', error);
    next(error);
  }
};