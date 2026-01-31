-- CreateTable
CREATE TABLE "usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "perfis" (
    "idPerfil" SERIAL NOT NULL,
    "nome_perfil" TEXT NOT NULL,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("idPerfil")
);

-- CreateTable
CREATE TABLE "postagens" (
    "idPostagem" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "imagem_capa" TEXT,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "postagens_pkey" PRIMARY KEY ("idPostagem")
);

-- CreateTable
CREATE TABLE "editais" (
    "idEdital" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "editalurl" TEXT NOT NULL,
    "data_publicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_validade" TIMESTAMP(3) NOT NULL,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "editais_pkey" PRIMARY KEY ("idEdital")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "idComentario" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "postagemId" INTEGER NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("idComentario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfis"("idPerfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postagens" ADD CONSTRAINT "postagens_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "editais" ADD CONSTRAINT "editais_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_postagemId_fkey" FOREIGN KEY ("postagemId") REFERENCES "postagens"("idPostagem") ON DELETE RESTRICT ON UPDATE CASCADE;
