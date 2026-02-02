import prisma from '../config/database.js';
import bcrypt from "bcryptjs";
import { generateToken } from '../config/jwt.js';
import {
  AppError,
} from '../errors/AppError.js';

export const login = async({email, senha}) => {
    const usuario = await prisma.usuario.findUnique({
        where: { email },
    });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))){
        throw new AppError(
            'Credenciais inválidas',
            401,
            'INVALID_CREDENTIALS'
        );
    }

    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
    });

    const { senha: _, ...userWithoutPassword } = usuario;

    return {
      usuario: userWithoutPassword,
      token,
    };
}