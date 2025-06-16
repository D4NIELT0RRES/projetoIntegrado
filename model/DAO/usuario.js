/***************************************************************************************
 * OBJETIVO: Model responsável pelo CRUD de dados referente a RECEITAS no BANCO DE DADOS.
 * DATA: 20/05/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//TRY-CATCH - usado para nao derrubar a api depois de subir ela, e usando o console.log ela guia o lugar do erro (Sempre usar Try-Catch)

//quando for script que nao retorna dados (insert,update e delete) -> executeRawUnsafe
//quando for script que tem algum retorno (return) - queryRawUnsafe

//Import da biblioteca do prisma client para executar scripts no BD
const {PrismaClient} = require('@prisma/client')

//Instancia da classe do prisma client, para gerar um objeto
const prisma = new PrismaClient()

//Função para inserir no Banco da Dados um novo usuário
const insertUsuario = async function (usuario){

    try {
        let sql = `insert into tbl_usuario(
                                            nome_usuario,
                                            email,
                                            senha,
                                            palavra_chave,
                                            foto_perfil
                                          ) values (
                                            '${usuario.nome_usuario}',
                                            '${usuario.email}',
                                            '${usuario.senha}',
                                            '${usuario.palavra_chave}',
                                            '${usuario.foto_perfil}'
                                          )`
        //Executa o script SQL no BD e aguarda o retorno no BD
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            let sqlSelect = `select * from tbl_usuario where nome_usuario = '${usuario.nome_usuario}' order by id desc limit 1`
            let criado = await prisma.$queryRawUnsafe(sqlSelect)
            
            return criado[0]
        }else{
            return false
        }       
    }catch(error){      
        console.log(error);
          
        return false
    }
}

//Função para atualizar no Banco de Dados um usuário existente
const updateUsuario = async function (usuario){

    try {
        let sql = `update tbl_usuario set  nome_usuario     = '${usuario.nome_usuario}',
                                           email            = '${usuario.email}',
                                           senha            = '${usuario.senha}',
                                           palavra_chave    = '${usuario.palavra_chave}',
                                           foto_perfil      = '${usuario.foto_perfil}'
                                           where id = ${usuario.id}`

        //Executa o script SQL no BD e aguarda o retorno no BD
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            let sqlSelect = `select * from tbl_usuario where nome_usuario = '${usuario.nome_usuario}' order by id desc limit 1`
            let criado = await prisma.$queryRawUnsafe(sqlSelect)
            
            return criado[0]
        }else{
            return false
        } 
    }catch(error){
        return false   
    }
}

//Função para excluir no Banco de Dados um usuário existente
const deleteUsuario = async function(id){

    try {
        let idUsuario = id
        let sql = `delete from tbl_usuario where id = ${idUsuario}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

//Função para retornar do Banco de Dados uma lista de usuário
const selectAllUsuario = async function (){

    try {
        let sql = `select * from tbl_usuario`

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

//Função para buscar no Banco de Dados um usuário pelo ID
const selectByIdUsuario = async function (id){

    try {
        let idUsuario = id        
        let sql = `select * from tbl_usuario where id = ${idUsuario}`

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

//Função para buscar no Banco de Dados um usuário pelo nome
const selectByNomeUsuario = async function (nome){

    try {
        let nomeUsuario = nome
        let sql = `SELECT * FROM tbl_usuario WHERE nome_usuario = ${nomeUsuario};`
        
        const result = await prisma.$queryRawUnsafe(sql)

        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.error(error) 
        return false
    }
}


//Função para buscar no Banco de Dados um email
const updatePassword = async function (dadosRecSenha){

    try {
        let sql = `UPDATE tbl_usuario 
        SET senha = "${dadosRecSenha.senha}"
        WHERE email = "${dadosRecSenha.email}"
        AND palavra_chave = "${dadosRecSenha.palavra_chave}";`

        let result = await prisma.$executeRawUnsafe(sql);

        if(result){

            return result
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

// console.log(updatePassword('gabriel@souza.com.br', '54321', '0511' ))

//Função para buscar no banco de dados um usuário através do email e senha ->> login
const loginUsuario = async function (dadosLogin){

    try {
      
        let sql = `select * from tbl_usuario where email = "${dadosLogin.email}" and senha = "${dadosLogin.senha}";`

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

const receberIdDoUsuario = async function () {
    try {
        let sql = `SELECT * FROM tbl_usuario ORDER BY id DESC LIMIT 1;`
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            console.log(result)
            return true
        } else {
            return false
        }
    } catch (error) {

        return false
    }
}




module.exports = {
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectByIdUsuario,
    selectByNomeUsuario,
    updatePassword,
    loginUsuario,
    receberIdDoUsuario
}