import prisma from '../config/database.js';
import bcrypt from "bcryptjs";
import {
  ConflictError,
} from '../errors/appError.js';

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

  // Verifica se é o primeiro usuário
  const usuariosCount = await prisma.usuario.count();
  const perfilId = usuariosCount === 0 ? 2 : 1; // 2 para ADMIN, 1 para padrão

  const senhaHash = await bcrypt.hash(senha, 10);
  
  const dadosUsuario = {
    nome,
    email,
    senha: senhaHash,
    perfilId,
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
  if (data.senha) updateData.senha = await bcrypt.hash(data.senha, 10);

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

  // Verifica se o usuário tem referências (editais, postagens, comentários)
  const [editaisCount, postagensCount, comentariosCount] = await Promise.all([
    prisma.edital.count({
      where: { autorId: usuario.idUsuario },
    }),
    prisma.postagem.count({
      where: { autorId: usuario.idUsuario },
    }),
    prisma.comentario.count({
      where: { usuarioId: usuario.idUsuario },
    }),
  ]);

  // Se tem referências, bloqueia a deleção
  if (editaisCount > 0 || postagensCount > 0 || comentariosCount > 0) {
    const motivos = [];
    if (editaisCount > 0) motivos.push(`${editaisCount} edital(is)`);
    if (postagensCount > 0) motivos.push(`${postagensCount} postagem(ens)`);
    if (comentariosCount > 0) motivos.push(`${comentariosCount} comentário(s)`);

    throw new ConflictError(
      `Não é possível deletar usuário. Ele é autor de: ${motivos.join(', ')}`,
      'usuario'
    );
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