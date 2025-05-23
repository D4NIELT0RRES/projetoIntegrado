/***************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio do CRUD do USUÁRIO.
 * DATA: 20/05/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//Import do arquivo de configuração para a mensagem e status code
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar um CRUD no banco de dados
const usuarioDAO = require('../../model/DAO/usuario')

//Função para inserir um novo usuário
const inserirUsuario = async function (usuario, contentType){

    try {
        if(contentType == 'application/json'){

            if(usuario.nome_usuario     == undefined || usuario.nome_usuario       == '' || usuario.nome_usuario     == null || usuario.nome_usuario.length  > 50  ||
               usuario.email            == undefined || usuario.email              == '' || usuario.email            == null || usuario.email.length         > 100 ||
               usuario.senha            == undefined || usuario.senha              == '' || usuario.senha            == null || usuario.senha.length         > 12  ||
               usuario.palavra_chave    == undefined || usuario.palavra_chave      == '' || usuario.palavra_chave    == null || usuario.palavra_chave.length > 25  ||
               usuario.foto_perfil      == undefined || usuario.foto_perfil.length > 255 ||
               usuario.data_criacao     == undefined || usuario.data_criacao       == '' || usuario.data_criacao     == null ||
               usuario.data_atualizacao == undefined || usuario.data_atualizacao   == '' || usuario.data_atualizacao == null 
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS//400
            }else{
                //Encaminha os dados do novo usuário para ser inserida do Banco de Dados
                let resultUsuario = await usuarioDAO.insertUsuario(usuario)

                if(resultUsuario){
                    return MESSAGE.SUCCESS_CREATED_ITEM //201
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE//415
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500   
    }
}

//Função para atualizar um usuário
const atualizarUsuario = async function (usuario, id,contentType){

    try {
        if(contentType == 'application/json'){
            
            if(usuario.nome_usuario     == undefined || usuario.nome_usuario       == '' || usuario.nome_usuario     == null || usuario.nome_usuario.length  > 50  ||
               usuario.email            == undefined || usuario.email              == '' || usuario.email            == null || usuario.email.length         > 100 ||
               usuario.senha            == undefined || usuario.senha              == '' || usuario.senha            == null || usuario.senha.length         > 12  || 
               usuario.palavra_chave    == undefined || usuario.palavra_chave      == '' || usuario.palavra_chave    == null || usuario.palavra_chave.length > 25  ||
               usuario.foto_perfil      == undefined || usuario.foto_perfil.length > 255 ||
               usuario.data_criacao     == undefined || usuario.data_criacao       == '' || usuario.data_criacao     == null ||
               usuario.data_atualizacao == undefined || usuario.data_atualizacao   == '' || usuario.data_atualizacao == null ||
               id == undefined || id == '' || id == null || isNaN(id) || id <= 0
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS//400
            }else{
                //Validar se o id existe no Banco de Dados
                let resultUsuario = await buscarUsuario(parseInt(id))
                if(resultUsuario.status_code == 200){

                    usuario.id = parseInt(id)
                    let result = await usuarioDAO.updateUsuario(usuario)

                    if(result){
                        return MESSAGE.SUCCESS_UPDATE_ITEM//200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
                    }
                }else if(resultUsuario.status_code == 404){
                    return MESSAGE.ERROR_NOT_FOUND//404
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE//415
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500   
    }
}

//Função para deletar um usuário
const excluirUsuario = async function(id){
    try {
        if(id == undefined || id == '' || id == null || isNaN(id) || id <= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            let resultUsuario = await buscarUsuario(parseInt(id))

            if(resultUsuario.status_code == 200){
                let result = await usuarioDAO.deleteUsuario(parseInt(id))

                if(result){
                    return MESSAGE.SUCCESS_DELETE_ITEM
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }else if(resultUsuario.status_code == 404){
                return MESSAGE.ERROR_NOT_FOUND
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
            }
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500   
    }
}

//Função para listar usuários
const listarUsuario = async function(){
     try {
        let dadosUsuario = {}
        
        let resultUsuario = await usuarioDAO.selectAllUsuario()
        if(resultUsuario != false || typeof(resultUsuario) == 'object'){
            if(resultUsuario.length > 0){

                dadosUsuario.status = true
                dadosUsuario.status_code = 200
                dadosUsuario.items = resultUsuario.length
                dadosUsuario.games = resultUsuario

                return dadosUsuario//20
            }else{
                return MESSAGE.ERROR_NOT_FOUND//400
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
}

//Função para buscar um usuário pelo id
const buscarUsuario = async function (id){

    try {
        if(id == undefined || id == '' || id == null || isNaN(id) || id <= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS//400
        }else{
            let dadosUsuario = {}

            let resultUsuario = await usuarioDAO.selectByIdUsuario(parseInt(id))

            if(resultUsuario != false || typeof(resultUsuario) == 'object'){
                if(resultUsuario.length > 0){

                    dadosUsuario.status = true
                    dadosUsuario.status_code = 200
                    dadosUsuario.games = resultUsuario

                    return dadosUsuario//200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND//404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
            }
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500   
    }
}

//Função para buscar um usuário pelo nome
const buscarUsuarioPorNome = async function(nome_usuario){

    try {
        if(nome_usuario == undefined || nome_usuario == '' || nome_usuario == null || nome_usuario.length > 50){
            return MESSAGE.ERROR_REQUIRED_FIELDS//400
        }else{
            let dadosUsuario = {}

            let resultUsuario = await usuarioDAO.selectByNomeUsuario(String(nome_usuario))

            if(resultUsuario != false || typeof(resultUsuario) == 'object'){
                if(resultUsuario.length > 50){

                    dadosUsuario.status = true
                    dadosUsuario.status_code = 200
                    dadosUsuario.games = resultUsuario

                    return dadosUsuario//200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND//404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
            }
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500   
    }
}

module.exports = {
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    listarUsuario,
    buscarUsuario,
    buscarUsuarioPorNome
}