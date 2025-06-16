/***************************************************************************************
 * OBJETIVO: Model responsável pelo CRUD de dados referente a RECEITAS no BANCO DE DADOS.
 * DATA: 02/06/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertReceita = async function (receita) {
    try {
        console.log(receita);

        // Transformar ingrediente em string se for objeto/array
        const ingrediente = JSON.stringify(receita.ingrediente).replace(/'/g, "\\'");

        let sql = `
            INSERT INTO tbl_receita (
                titulo,
                tempo_preparo,
                foto_receita,
                ingrediente,
                modo_preparo,
                dificuldade,
                id_usuario
            ) VALUES (
                '${receita.titulo}',
                '${receita.tempo_preparo}',
                '${receita.foto_receita}',
                '${ingrediente}',
                '${receita.modo_preparo}',
                '${receita.dificuldade}',
                ${Number(receita.id_usuario)}
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            let sqlSelect = `
                SELECT * FROM tbl_receita 
                WHERE titulo = '${receita.titulo}' 
                ORDER BY id DESC 
                LIMIT 1;
            `;
            let criado = await prisma.$queryRawUnsafe(sqlSelect);
            return criado[0];
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao inserir receita:", error);
        return false;
    }
};

// Atualizar uma receita existente
const updateReceita = async function (receita) {
    try {
        let sql = `
            UPDATE tbl_receita SET
                titulo        = '${receita.titulo}',
                tempo_preparo = '${receita.tempo_preparo}',
                foto_receita  = '${receita.foto_receita}',
                ingrediente   = '${receita.ingrediente}',
                modo_preparo  = '${receita.modo_preparo}',
                dificuldade   = '${receita.dificuldade}',
                id_usuario    = ${Number(receita.id_usuario)}
            WHERE id = ${Number(receita.id)};
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        return result ? true : false;
    } catch (error) {
        console.error("Erro ao atualizar receita:", error);
        return false;
    }
};

// Excluir uma receita
const deleteReceita = async function (id) {
    try {
        let sql = `DELETE FROM tbl_receita WHERE id = ${Number(id)};`;
        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error("Erro ao deletar receita:", error);
        return false;
    }
};

// Listar todas as receitas
const selectAllReceita = async function () {
    try {
        let sql = `SELECT * FROM tbl_receita;`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result && result.length > 0 ? result : false;
    } catch (error) {
        console.error("Erro ao buscar todas as receitas:", error);
        return false;
    }
};

// Buscar receita por ID
const selectByIdReceita = async function (id) {
    try {
        let sql = `SELECT * FROM tbl_receita WHERE id = ${Number(id)};`;
        let result = await prisma.$queryRawUnsafe(sql);
        return result && result.length > 0 ? result : false;
    } catch (error) {
        console.error("Erro ao buscar receita por ID:", error);
        return false;
    }
};

// Buscar receitas pelo nome do usuário
const selectByUserName = async function (userName) {
    try {
        let sql = `
            SELECT r.*
            FROM tbl_receita r
            JOIN tbl_usuario u ON r.id_usuario = u.id
            WHERE u.nome_usuario = '${userName}';
        `;

        let result = await prisma.$queryRawUnsafe(sql);
        return result && result.length > 0 ? result : false;
    } catch (error) {
        console.error("Erro ao buscar receitas por nome de usuário:", error);
        return false;
    }
};

// Buscar receitas por ID de usuário
const selectReceitasByUsuarioId = async function (idUsuario) {
    try {
        let result = await prisma.$queryRaw`
            SELECT * FROM tbl_receita
            WHERE id_usuario = ${Number(idUsuario)};
        `;

        return result && result.length > 0 ? result : false;
    } catch (error) {
        console.error("Erro ao buscar receitas por ID de usuário:", error);
        return false;
    }
};

module.exports = {
    insertReceita,
    updateReceita,
    deleteReceita,
    selectAllReceita,
    selectByIdReceita,
    selectByUserName,
    selectReceitasByUsuarioId
};