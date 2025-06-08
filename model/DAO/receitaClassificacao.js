/***************************************************************************************
 * OBJETIVO: Model responsável pelo CRUD de dados referente a receita_classificacao no BANCO DE DADOS.
 * DATA: 08/06/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')
const { ERROR_CONTENT_TYPE } = require('../../modulo/config')

//Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()

const insertReceitaClassificacao = async function (ReceitaClassificacao) {
    try {
        let sql = `
            INSERT INTO tbl_receita_classificacao (
                id_receita,
                id_classificacao
            ) VALUES (
                ${ReceitaClassificacao.id_receita},
                ${ReceitaClassificacao.id_classificacao}
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            console.log('✅ Classificação inserida com sucesso!');
            return true;
        } else {
            console.log('❌ Falha ao inserir classificação no banco');
            return false;
        }

    } catch (error) {
        console.log('❌ ERRO SQL AO INSERIR CLASSIFICAÇÃO:', error);
        return false;
    }
};

const updateReceitaClassificacao = async function (ReceitaClassificacao){
    try{
        // Corrigido 'tlb_' para 'tbl_' no nome da tabela
        let sql = `UPDATE tbl_receita_classificacao SET 
                        id_receita = ${ReceitaClassificacao.id_receita},
                        id_classificacao = ${ReceitaClassificacao.id_classificacao}
                    WHERE id = ${ReceitaClassificacao.id}`

        let resultReceitaClassificacao = await prisma.$executeRawUnsafe(sql)

        if(resultReceitaClassificacao){
            return true
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

const deleteReceitaClassificacao = async function (id){
    try {
        let sql = `DELETE FROM tbl_receita_classificacao WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)  // faltava o await e definição da variável result
        
        if (result){
            return true
        }else{
            return false
        }
        
    }catch(error){
        return false
    }
}

const selectAllReceitaClassificacao = async function (){
    try {
        let sql =  `SELECT * FROM tbl_receita_classificacao ORDER BY id DESC`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const selectByIdReceitaClassificacao = async function (id) {
    try {
        // Corrigido a query para WHERE id = ${id}
        let sql = `SELECT * FROM tbl_receita_classificacao WHERE id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)
  
        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const selectReceitaByIdClassificacao = async function (idClassificacao) {
    try {
        const sql = `
            SELECT tbl_receita.*
            FROM tbl_classificacao
            INNER JOIN tbl_receita_classificacao
                ON tbl_classificacao.id = tbl_receita_classificacao.id_classificacao
            INNER JOIN tbl_receita
                ON tbl_receita.id = tbl_receita_classificacao.id_receita
            WHERE tbl_classificacao.id = ${idClassificacao};
        `

        const result = await prisma.$queryRawUnsafe(sql)

        if (result && result.length > 0) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.error("Erro no selectReceitaByIdClassificacao:", error)
        return false
    }
}

const selectClassificacaoByIdReceita = async function (idReceita) {
    try {
        let sql = `
            SELECT tbl_classificacao.*
            FROM tbl_receita_classificacao
            INNER JOIN tbl_classificacao
              ON tbl_receita_classificacao.id_classificacao = tbl_classificacao.id
            WHERE tbl_receita_classificacao.id_receita = ${idReceita};
        `
        let result = await prisma.$queryRawUnsafe(sql) // faltava await
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.error('Erro no selectClassificacaoByIdReceita:', error)
        return false
    }
}

const selectUsuarioByIdReceita = async function (idReceita) {
    try {
        let sql = `
            SELECT tbl_usuario.* 
            FROM tbl_usuario
            INNER JOIN tbl_receita_classificacao
                ON tbl_usuario.id = tbl_receita_classificacao.id_usuario
            INNER JOIN tbl_receita
                ON tbl_receita.id = tbl_receita_classificacao.id_receita
            WHERE tbl_receita.id = ${idReceita};
        `

        let result = await prisma.$queryRawUnsafe(sql) // faltava await

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertReceitaClassificacao,
    updateReceitaClassificacao,
    deleteReceitaClassificacao,
    selectAllReceitaClassificacao,
    selectByIdReceitaClassificacao,
    selectReceitaByIdClassificacao,
    selectClassificacaoByIdReceita,
    selectUsuarioByIdReceita
}