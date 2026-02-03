import prisma from '../config/database.js';
import bcrypt from "bcryptjs";
import { generateToken } from '../config/jwt.js';
import {
  AppError,
} from '../errors/AppError.js';

export const login = async({email, senha}) => {
    const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
            perfil: {
                select: {
                    idPerfil: true,
                    nome_perfil: true,
                },
            },
        },
    });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))){
        throw new AppError(
            'Credenciais inválidas',
            401,
            'INVALID_CREDENTIALS'
        );
    }

    const token = generateToken({
      id: usuario.idUsuario,
      email: usuario.email,
      perfilId: usuario.perfilId,
      nomePerfil: usuario.perfil.nome_perfil,
    });

    const { senha: _, ...userWithoutPassword } = usuario;

    return {
      usuario: userWithoutPassword,
      token,
    };
}