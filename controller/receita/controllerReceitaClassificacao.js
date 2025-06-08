/***************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio do CRUD da Receita.
 * DATA: 21/05/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//Import do arquivo de mensagens e status code do projeto
const MESSAGE = require('../../modulo/config.js')

const receitaClassificacaoDAO = require('../../model/DAO/receitaClassificacao.js')

const inserirReceitaClassificacao = async function (receitaClassificacao, contentType){
    try {
        if(contentType == 'application/json'){

            if (
                receitaClassificacao.id_receita       == ''     || receitaClassificacao.id_receita         == undefined    || receitaClassificacao.id_receita       == null          || isNaN(receitaClassificacao.id_receita)          || receitaClassificacao.id_receita <=0 ||
                receitaClassificacao.id_classificacao == ''     || receitaClassificacao.id_classificacao   == undefined    || receitaClassificacao.id_classificacao == null          || isNaN(receitaClassificacao.id_classificacao)    || receitaClassificacao.id_classificacao<=0 
            )
            {
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                let resultReceitaClassificacao = await receitaClassificacaoDAO.insertReceitaClassificacao(receitaClassificacao)
                if(resultReceitaClassificacao)
                    return MESSAGE.SUCCESS_CREATED_ITEM //201
                else
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const atualizarReceitaClassificacao = async function (id, receitaClassificacao, contentType) {
    try {
        if(contentType == 'application/json'){

            if(
                receitaClassificacao.id_receita       == ''     || receitaClassificacao.id_receita         == undefined    || receitaClassificacao.id_receita       == null          || isNaN(receitaClassificacao.id_receita)          || receitaClassificacao.id_receita <=0 ||
                receitaClassificacao.id_classificacao == ''     || receitaClassificacao.id_classificacao   == undefined    || receitaClassificacao.id_classificacao == null          || isNaN(receitaClassificacao.id_classificacao)    || receitaClassificacao.id_classificacao<=0
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                let resultReceitaClassificacao = await receitaClassificacaoDAO.selectByIdReceitaClassificacao(parseInt(id))

                if(resultReceitaClassificacao != false && typeof(resultReceitaClassificacao) == 'object'){
                    if(resultReceitaClassificacao.length > 0){

                        receitaClassificacao.id = parseInt(id)

                        let result = await receitaClassificacaoDAO.updateReceitaClassificacao(receitaClassificacao)

                        if(result){
                            return MESSAGE.SUCCESS_UPDATE_ITEM //200
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return MESSAGE.ERROR_NOT_FOUND //404
                    }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirReceitaClassificacao = async function (id) {
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }else{
            let resultReceitaClassificacao = await receitaClassificacaoDAO.selectByIdReceitaClassificacao(parseInt(id))

            if(resultReceitaClassificacao != false && typeof(resultReceitaClassificacao) == 'object'){
                if(resultReceitaClassificacao.length > 0){

                    let result = await receitaClassificacaoDAO.deleteReceitaClassificacao(parseInt(id))

                    if(result){
                        return MESSAGE.SUCCESS_UPDATE_ITEM //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const listarReceitaClassificacao = async function () {
    try{
       let dadosReceitaClassificacao = {}

       let resultReceitaClassificacao = await receitaClassificacaoDAO.selectAllReceitaClassificacao()

       if(resultReceitaClassificacao != false && typeof(resultReceitaClassificacao) == 'object'){
            if(resultReceitaClassificacao.length > 0){

                dadosReceitaClassificacao.status = true
                dadosReceitaClassificacao.status_code = 200
                dadosReceitaClassificacao.items = resultReceitaClassificacao.length
                dadosReceitaClassificacao.receita_classificacao = resultReceitaClassificacao

                return dadosReceitaClassificacao
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
       }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
       }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const buscarClassificacaoPorReceita = async function (idReceita) {
    try {
        if(idReceita == '' || idReceita == undefined || idReceita == null || isNaN(idReceita) || idReceita <= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS; //400
        } else {
            let dadosClassificacaoPorReceita = {}

            let resultClassificacaoPorReceita = await receitaClassificacaoDAO.selectClassificacaoByIdReceita(parseInt(idReceita))

            if(resultClassificacaoPorReceita != false && typeof(resultClassificacaoPorReceita) == 'object'){
                if(resultClassificacaoPorReceita.length > 0){
                    dadosClassificacaoPorReceita.status = true
                    dadosClassificacaoPorReceita.status_code = 200
                    dadosClassificacaoPorReceita.classificacao = resultClassificacaoPorReceita

                    return dadosClassificacaoPorReceita
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const buscarReceitaClassificacao = async function (idClassificacao) {
    try {
        if(idClassificacao == '' || idClassificacao == undefined || idClassificacao == null || isNaN(idClassificacao) || idClassificacao <=0){
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }else{

            let dadosReceitaClassificacao = {}

            let resultReceitaClassificacao = await receitaClassificacaoDAO.selectReceitaByIdClassificacao(parseInt(idClassificacao))

            if(resultReceitaClassificacao != false && typeof(resultReceitaClassificacao) == 'object'){
                if(resultReceitaClassificacao.length > 0){

                    dadosReceitaClassificacao.status = true
                    dadosReceitaClassificacao.status_code = 200
                    dadosReceitaClassificacao.receita = resultReceitaClassificacao

                    return dadosReceitaClassificacao
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }    
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {

    inserirReceitaClassificacao,
    atualizarReceitaClassificacao,
    excluirReceitaClassificacao,
    listarReceitaClassificacao,
    buscarClassificacaoPorReceita,
    buscarReceitaClassificacao
}