/***************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio do CRUD da Classificacao.
 * DATA: 05/06/2025
 * AUTOR: Gabriel Soares
 * Versão: 1.0
 ***************************************************************************************/

//Import do arquivo de configuração para a mensagem e status code
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar um CRUD no banco de dados
const classificacaoDAO = require('../../model/DAO/classificacao')

//Função para inserir uma nova classificacao
const inserirClassificacao = async function (classificacao, contentType){
    
    try {
        if(contentType == 'application/json'){

            if(classificacao.nome     == undefined || classificacao.nome       == '' || classificacao.nome     == null || classificacao.nome.length  > 50 ){
                return MESSAGE.ERROR_REQUIRED_FIELDS//400
            }else{
                //Encaminha os dados da nova classificacao para ser inserida do Banco de Dados
                let resultClassificacao = await classificacaoDAO.insertClassificacao(classificacao)

                if (resultClassificacao) {
                    return {
                        status_code: 201,
                        message: "Classificação criada com sucesso",
                        usuario: resultClassificacao
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE//415
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500   
    }
}

//Função para atualizar uma classificacao
const atualizarClassificacao = async function (classificacao, id,contentType){

    try {
        if(contentType == 'application/json'){
            
            if(classificacao.nome     == undefined || classificacao.nome       == '' || classificacao.nome     == null || classificacao.nome.length  > 50 ||
               id == undefined || id == '' || id == null || isNaN(id) || id <= 0
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS//400
            }else{
                //Validar se o id existe no Banco de Dados
                let resultClassificacao = await buscarClassificacao(parseInt(id))
                if (resultClassificacao) {
                    return {
                        status_code: 201,
                        message: "Classificação criada com sucesso",
                        usuario: resultClassificacao
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE//415
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500   
    }
}

//Função para deletar uma classificacao
const excluirClassificacao = async function(id){
    try {
        if(id == undefined || id == '' || id == null || isNaN(id) || id <= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }else{
            let resultClassificacao = await buscarClassificacao(parseInt(id))

            if(resultClassificacao.status_code == 200){
                let result = await classificacaoDAO.deleteClassificacao(parseInt(id))

                if(result){
                    return MESSAGE.SUCCESS_DELETE_ITEM
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }else if(resultClassificacao.status_code == 404){
                return MESSAGE.ERROR_NOT_FOUND
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
            }
        }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500   
    }
}

//Função para listar classificações
const listarClassificacao = async function(){
     try {
        let dadosClassificacao = {}
        
        let resultClassificacao = await classificacaoDAO.selectAllClassificacao()
        if(resultClassificacao != false || typeof(resultClassificacao) == 'object'){
            if(resultClassificacao.length > 0){

                dadosClassificacao.status = true
                dadosClassificacao.status_code = 200
                dadosClassificacao.items = resultClassificacao.length
                dadosClassificacao.usuario = resultClassificacao

                return dadosClassificacao//20
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

//Função para buscar uma classificacao pelo id
const buscarClassificacao = async function (id){

    try {
        if(id == undefined || id == '' || id == null || isNaN(id) || id <= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS//400
        }else{
            let dadosClassificacao = {}

            let resultClassificacao = await classificacaoDAO.selectByIdClassificacao(parseInt(id))

            if(resultClassificacao != false || typeof(resultClassificacao) == 'object'){
                if(resultClassificacao.length > 0){

                    dadosClassificacao.status = true
                    dadosClassificacao.status_code = 200
                    dadosClassificacao.classificacao = resultClassificacao

                    return dadosClassificacao//200
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

//Função para buscar uma classificacao pelo nome
const buscarClassificacaoPorNome = async function(nome_classificacao){
    try {
        if(nome_classificacao == undefined || nome_classificacao == '' || nome_classificacao == null || nome_classificacao.length  > 50){
            return MESSAGE.ERROR_REQUIRED_FIELDS//400
        }else{
            let dadosClassificacao = {}

            let resultClassificacao = await classificacaoDAO.selectByNameClassificacao(nome_classificacao)

            if(resultClassificacao != false || typeof(resultClassificacao) == 'object'){
                if(resultClassificacao.length > 0){

                    dadosClassificacao.status = true
                    dadosClassificacao.status_code = 200
                    dadosClassificacao.classificacao = resultClassificacao[0]

                    return dadosClassificacao//200
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
    inserirClassificacao,
    atualizarClassificacao,
    excluirClassificacao,
    listarClassificacao,
    buscarClassificacao,
    buscarClassificacaoPorNome
}