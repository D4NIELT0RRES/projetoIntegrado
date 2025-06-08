/***************************************************************************************
 * OBJETIVO: Model responsável pelo CRUD de dados referente a RECEITAS no BANCO DE DADOS.
 * DATA: 02/06/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//Import da biblioteca do prisma client para executar scripts no BD
const {PrismaClient} = require('@prisma/client')

//Instancia da classe do prisma client, para gerar um objeto
const prisma = new PrismaClient()

//Função para inserir no Banco da Dados uma nova receita
const insertReceita = async function(receita){

    try {
        let sql = `insert into tbl_receita( titulo,
                                            tempo_preparo,
                                            foto_receita,
                                            ingrediente,
                                            modo_preparo,
                                            dificuldade,
                                            id_usuario
                                          ) values (
                                            '${receita.titulo}',
                                            '${receita.tempo_preparo}',
                                            '${receita.foto_receita}',
                                            '${receita.ingrediente}',
                                            '${receita.modo_preparo}',
                                            '${receita.dificuldade}',
                                             ${receita.id_usuario}
                                           );`
        //Executa o script SQL no BD e aguarda o retorno no BD
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            let sqlSelect = `SELECT * FROM tbl_receita WHERE titulo = '${receita.titulo}' ORDER BY id DESC LIMIT 1` // DEVOLVER O ID DA RECEITA PARA USAR NA CONTROLLER
            let criado = await prisma.$queryRawUnsafe(sqlSelect)
            return criado[0]
        }else{
            return false
        }
    } catch(error){    
        return false
    }
}

//Função para atualizar no Banco de Dados uma receita existente
const updateReceita = async function(receita){
    
    try{

       let sql = `update tbl_receita set        titulo        = '${receita.titulo}',
                                                tempo_preparo = '${receita.tempo_preparo}',
                                                foto_receita  = '${receita.foto_receita}',
                                                ingrediente   = '${receita.ingrediente}',
                                                modo_preparo  = '${receita.modo_preparo}',
                                                dificuldade   = '${receita.dificuldade}',
                                                id_usuario    = '${receita.id_usuario}'
                                                where id = ${receita.id}`
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

//Função para excluir no Banco de Dados uma receita existente
const deleteReceita = async function(id){
    
    try{
        let idReceita = id
        let sql = `delete from tbl_receita where id=${idReceita}`

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
const selectAllReceita = async function(){
    
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

