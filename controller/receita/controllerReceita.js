/***************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio do CRUD da RECEITA.
 * DATA: 02/06/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

//Import do arquivo de configuração para a mensagem e status code
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar um CRUD no banco de dados
const receitaDAO = require('../../model/DAO/receita.js')

//Import das controllers para criar as relações com a receita
const controllerUsuario = require('../usuario/controllerUsuario.js')

const controllerReceitaClassificacao = require('../receita/controllerReceitaClassificacao.js')

//Função para inserir uma nova receita
const inserirReceita = async function(receita, contentType) {
    try {
        if (contentType == 'application/json') {

            if (
                receita.titulo        == undefined || receita.titulo        == '' || receita.titulo        == null || receita.titulo.length        > 100 ||
                receita.tempo_preparo == undefined || receita.tempo_preparo == '' || receita.tempo_preparo == null || receita.tempo_preparo.length > 10  ||
                receita.foto_receita  == undefined || receita.foto_receita  == '' || receita.foto_receita  == null || receita.foto_receita.length  > 255 ||
                receita.ingrediente   == undefined || receita.ingrediente   == '' ||
                receita.modo_preparo  == undefined || receita.modo_preparo  == '' ||
                receita.dificuldade   == undefined || receita.dificuldade   == '' || receita.dificuldade   == null || receita.dificuldade.length   > 45  ||
                receita.id_usuario    == undefined || receita.id_usuario    == '' || receita.id_usuario    == null || receita.id_usuario <= 0
            ) {
                return MESSAGE.ERROR_REQUIRED_FIELDS // 400
            } else {
                let resultReceita = await receitaDAO.insertReceita(receita)

                if (resultReceita && resultReceita.id) {
                    for (let itemClassificacao of receita.classificacao) {
                        itemClassificacao.id_receita = resultReceita.id

                        console.log('Inserindo classificação:', itemClassificacao);

                        let resultClassificacao = await controllerReceitaClassificacao.inserirReceitaClassificacao(itemClassificacao, contentType)

                        if (!resultClassificacao) {
                            console.log('Falha ao inserir classificação:', itemClassificacao);
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                        }
                    }

                    return {
                        status_code: 201,
                        message: 'Receita criada com sucesso!',
                        receita: resultReceita
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Função para atualizar uma receita
const atualizarReceita = async function(receita,id,contentType){
    
    try{
       if(contentType == 'application/json'){

            if( receita.titulo        == undefined  ||  receita.titulo        == ''   || receita.titulo        == null   || receita.titulo.length        > 100  || 
                receita.tempo_preparo == undefined  ||  receita.tempo_preparo == ''   || receita.tempo_preparo == null   || receita.tempo_preparo.length > 10   || 
                receita.foto_receita  == undefined  ||  receita.foto_receita  == ''   || receita.foto_receita  == null   || receita.foto_receita.length  > 255  || 
                receita.dificuldade   == undefined  ||  receita.dificuldade   == ''   || receita.dificuldade   == null   || receita.dificuldade.length   > 45   || 
                receita.modo_preparo  == undefined  ||  receita.modo_preparo  == ''   ||
                receita.ingrediente   == undefined  ||  receita.ingrediente   == ''   ||
                id                    == undefined  ||  id                    == ''   || id                    == null   || isNaN(id)                 || id<= 0      ||
                receita.id_usuario    == undefined  ||  receita.id_usuario    == ''   || receita.id_usuario    == null   || isNaN(receita.id_usuario) || receita.id_usuario <= 0 
                
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS//400
            }else{
                let resultReceita = await receitaDAO.selectByIdReceita(parseInt(id))

                if(resultReceita != false || typeof(resultReceita) == 'object'){
                    if(resultReceita.length > 0){

                        receita.id = parseInt(id)

                        let result = await receitaDAO.updateReceita(receita)

                        if(result){
                            return MESSAGE.SUCCESS_UPDATE_ITEM//200
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//5
                        }
                    }else{
                        return MESSAGE.ERROR_NOT_FOUND//404
                    }
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

//Função para excluir um jogo 
const excluirReceita = async function(id){
    
    try{
        if(id == undefined || id == '' || id == null || isNaN(id) || id<= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS//400
        }else{
            let resultReceita = await controllerUsuario.buscarUsuario(parseInt(id))

            if(resultReceita.status_code == 200){
                let result = await receitaDAO.deleteReceita(parseInt(id))

                if(result){
                    return MESSAGE.SUCCESS_DELETE_ITEM//200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
                }
            }else if(resultReceita.status_code == 404){
                return MESSAGE.ERROR_NOT_FOUND//404
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
            }
        }
    }catch(error){
       return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500 
    }
}

//Função para retornar todas as receitas
const listarReceita = async function() {
    try {
        const arrayReceitas = []
        let dadosReceitas = {}

        let resultReceita = await receitaDAO.selectAllReceita()

        if(resultReceita != false && typeof(resultReceita) == 'object'){
            if(resultReceita.length > 0){
                dadosReceitas.status = true
                dadosReceitas.status_code = 200
                dadosReceitas.items = arrayReceitas

                for (let itemReceita of resultReceita) {
                    // Buscar o usuário e associar
                    let dadosUsuario = await controllerUsuario.buscarUsuario(itemReceita.id_usuario)
                    itemReceita.usuario = dadosUsuario.usuario
                    delete itemReceita.id_usuario

                    // Buscar classificações da receita pelo id da receita
                    let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id)

                    if (dadosClassificacao.status) {
                        itemReceita.classificacoes = dadosClassificacao.classificacao
                    } else {
                        itemReceita.classificacoes = []
                    }

                    arrayReceitas.push(itemReceita)
                }

                return dadosReceitas
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER   
    }
}


const buscarReceita = async function(id){
    
    try{
        if(id == undefined || id == '' || id == null || isNaN(id) || id<= 0){
            return MESSAGE.ERROR_REQUIRED_FIELDS//400
        }else{
            const arrayReceitas = []
            const dadosReceitas = {}

            //Chama a função para retornar os dados da receita
            let resultReceita = await receitaDAO.selectByIdReceita(parseInt(id))

            if(resultReceita != false && typeof(resultReceita) == 'object'){
            if(resultReceita.length > 0){
                dadosReceitas.status = true
                dadosReceitas.status_code = 200
                dadosReceitas.items = arrayReceitas

                for (let itemReceita of resultReceita) {
                    // Buscar o usuário e associar
                    let dadosUsuario = await controllerUsuario.buscarUsuario(itemReceita.id_usuario)
                    itemReceita.usuario = dadosUsuario.usuario
                    delete itemReceita.id_usuario

                    // Buscar classificações da receita pelo id da receita
                    let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id)

                    if (dadosClassificacao.status) {
                        itemReceita.classificacoes = dadosClassificacao.classificacao
                    } else {
                        itemReceita.classificacoes = []
                    }

                    arrayReceitas.push(itemReceita)
                }
                return dadosReceitas
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
        }
    }catch(error){
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
} 

//Função para retornar todas as receitas com base no nome de um usuário
const listarReceitaByUsername = async function(userName) {
    try {
        const arrayReceitas = []
        let dadosReceitas = {}

        let resultReceita = await receitaDAO.selectByUserName(userName) // ← certo


        if(resultReceita != false && typeof(resultReceita) == 'object'){
            if(resultReceita.length > 0){
                dadosReceitas.status = true
                dadosReceitas.status_code = 200
                dadosReceitas.items = arrayReceitas

                for (let itemReceita of resultReceita) {
                    // Buscar o usuário e associar
                    let dadosUsuario = await controllerUsuario.buscarUsuario(itemReceita.id_usuario)
                    itemReceita.usuario = dadosUsuario.usuario
                    delete itemReceita.id_usuario

                    // Buscar classificações da receita pelo id da receita
                    let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id)

                    if (dadosClassificacao.status) {
                        itemReceita.classificacoes = dadosClassificacao.classificacao
                    } else {
                        itemReceita.classificacoes = []
                    }

                    arrayReceitas.push(itemReceita)
                }

                return dadosReceitas
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            console.log(resultReceita)
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER   
    }
}

module.exports = {
    inserirReceita,
    atualizarReceita,
    excluirReceita,
    listarReceita,
    buscarReceita,
    listarReceitaByUsername
}