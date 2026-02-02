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
    senha: senhaHash,
    perfilId: 1,
  };

  const novoUsuario = await prisma.usuario.create({
    data: dadosUsuario,
    select: {
      idUsuario: true,
      nome: true,
      email: true,
    },
  });

  return novoUsuario;
};

export const getAllUsuario = async () =>{
  const usuario = await prisma.usuario.findMany({
    select: {
      idUsuario: true,
      nome: true,
      email: true,
      perfil: {
        select: {
          idPerfil: true,
          nome_perfil: true,
        },
      },
    },
  });

  return usuario;
};

export const getUsuarioByEmail = async (email) =>{
  return prisma.usuario.findUnique({
    where: { email },
      select: { 
        idUsuario: true,
        nome: true,
        email: true,
        perfil: {
          select: {
            idPerfil: true,
            nome_perfil: true,
          },
        },
      },
  });
};

export const updateUsuarioByEmail = async (email, data) => {
  const updateData = {};

  if (data.nome) updateData.nome = data.nome;
  if (data.perfilId) updateData.perfilId = data.perfilId;

  return prisma.usuario.update({
    where: { email },
    data: updateData,
    select: {
      idUsuario: true,
      nome: true,
      email: true,
      perfil: {
        select: {
          idPerfil: true,
          nome_perfil: true,
        },
      },
    },
  });
};

export const deleteUsuarioByEmail = async (email) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    return null;
  }

  return prisma.usuario.delete({
    where: { email },
    select: {
      idUsuario: true,
      nome: true,
      email: true,
    },
  });
};


export default {
  create,
};