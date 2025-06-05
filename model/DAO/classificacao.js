/***************************************************************************************
 * OBJETIVO: Model responsável pelo CRUD de dados referente a CLASSIFICACAO no BANCO DE DADOS.
 * DATA: 05/06/2025
 * AUTOR: Gabriel Soares
 * Versão: 1.0
 ***************************************************************************************/

//Import da biblioteca do prisma client para executar scripts no BD
const {PrismaClient} = require('@prisma/client')

//Instancia da classe do prisma client, para gerar um objeto
const prisma = new PrismaClient()

//Função para inserir no Banco da Dados uma nova classificacao
const insertClassificacao = async function(classificacao){

    try {
        let sql = `insert into tbl_classificacao(
                                                nome
                                                ) 
                                                values 
                                                (
                                                '${classificacao.nome}'
                                                );`
        //Executa o script SQL no BD e aguarda o retorno no BD
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            let sqlSelect = `SELECT * FROM tbl_classificacao WHERE nome = '${classificacao.nome}' ORDER BY id DESC LIMIT 1` // DEVOLVER O ID DA CLASSIFICACAO PARA USAR NA CONTROLLER
            let criado = await prisma.$queryRawUnsafe(sqlSelect)
            return criado[0]
        }else{
            return false
        }
    } catch(error){        
        return false
    }
}

//Função para atualizar no Banco de Dados uma classificacao existente
const updateClassificacao = async function(classificacao){
    
    try{

       let sql = `update tbl_classificacao set  nome     = '${classificacao.nome}'
                                                where id = ${classificacao.id}`
        //Executa o script SQL no BD e aguarda o retorno no BD
        let result = await prisma.$executeRawUnsafe(sql)
        
        if(result){
            return true
        }else{
            return false                    
        }                                  
    }catch(error){
        return false   
    }
}

//Função para excluir no Banco de Dados uma classificacao existente
const deleteClassificacao = async function(id){
    
    try{
        let idClassificacao = id
        let sql = `delete from tbl_classificacao where id=${idClassificacao}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }

    }catch(error){
        return false
    }
}

//Função para retornar do Banco de dados uma lista de receitas
const selectAllClassificacao = async function(){
    
    try{
        //Script SQL para retornar os dados do BD
        let sql = `select * from tbl_receita`

        //Executa o script SQL e aguarda o retorno dos dados
        let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    }catch(error){
        console.log(error);
        return false
    }
}

//Função para buscar no Banco de Dados um jogo pelo ID
const selectByIdReceita = async function(id){
    
    try{
       let idReceita = id
       let sql = `select * from tbl_receita where id=${idReceita}`
       
       let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

//Função para buscar no Banco de Dados um jogo pelo Título
const selectByTitleReceita = async function(id){
    
    try{
       let idReceita = id
       let sql = `select * from tbl_receita where titulo=${titulo}`
       
       let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

module.exports = {
    insertReceita,
    updateReceita,
    deleteReceita,
    selectAllReceita,
    selectByIdReceita,
    selectByTitleReceita
}

