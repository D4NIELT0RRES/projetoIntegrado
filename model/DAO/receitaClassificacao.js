/***************************************************************************************
 * OBJETIVO: Model responsável pelo CRUD de dados referente a receita_classificacao no BANCO DE DADOS.
 * DATA: 08/06/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

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

        let result = await prisma.$executeRawUnsafe(sql)
        
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

// **** FUNÇÃO ATUALIZADA AQUI PARA INCLUIR O NOME DA CLASSIFICAÇÃO ****
const selectClassificacaoByIdReceita = async function (idReceita) {
    try {
        let sql = `
            SELECT 
                rc.id_classificacao AS id_classificacao,
                c.nome AS nome
            FROM
                tbl_receita_classificacao AS rc
            INNER JOIN
                tbl_classificacao AS c ON rc.id_classificacao = c.id
            WHERE
                rc.id_receita = ${idReceita};
        `;
        let result = await prisma.$queryRawUnsafe(sql);
        if (result) {
            return result; // Retorna a lista de objetos com { id_classificacao, nome }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erro no selectClassificacaoByIdReceita:', error);
        return false;
    }
};

// **** FUNÇÃO COMENTADA E RECOMENDAÇÃO DE REVISÃO (NÃO DEVE ESTAR AQUI) ****
/*
A função selectUsuarioByIdReceita está usando tbl_receita_classificacao
para encontrar o usuário da receita. O usuário da receita está diretamente
na tbl_receita, não na tabela N/N de classificação.
Recomenda-se mover esta lógica para o DAO da Receita (receita.js)
e alterar a query para:
    SELECT tbl_usuario.* FROM tbl_usuario
    INNER JOIN tbl_receita
        ON tbl_usuario.id = tbl_receita.id_usuario
    WHERE tbl_receita.id = ${idReceita};
*/
// const selectUsuarioByIdReceita = async function (idReceita) {
//     try {
//         let sql = `
//             SELECT tbl_usuario.* //             FROM tbl_usuario
//             INNER JOIN tbl_receita_classificacao
//                 ON tbl_usuario.id = tbl_receita_classificacao.id_usuario 
//             INNER JOIN tbl_receita
//                 ON tbl_receita.id = tbl_receita_classificacao.id_receita 
//             WHERE tbl_receita.id = ${idReceita};
//         `

//         let result = await prisma.$queryRawUnsafe(sql)

//         if(result){
//             return result
//         }else{
//             return false
//         }
//     } catch (error) {
//         return false
//     }
// }


module.exports = {
    insertReceitaClassificacao,
    updateReceitaClassificacao,
    deleteReceitaClassificacao,
    selectAllReceitaClassificacao,
    selectByIdReceitaClassificacao,
    selectReceitaByIdClassificacao,
    selectClassificacaoByIdReceita,
    // selectUsuarioByIdReceita // Comentado no module.exports também
};