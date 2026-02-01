import prisma from '../config/database.js';
import bcrypt from "bcryptjs";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../errors/AppError.js';

const emailExists = async email => {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  return !!usuario;
};

export const create = async({nome, email, senha}) => {
  const emailJaExiste = await emailExists(email);
  if (emailJaExiste) {
    throw new ConflictError('Email já cadastrado no sistema', 'email');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  
  const dadosUsuario = {
    nome,
    email,
    senhaHash,
    perfilId: 1,
  };

  const novoUsuario = await prisma.usuario.create({
    data: dadosUsuario,
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });

  return novoUsuario;
};

export default {
  create,
};