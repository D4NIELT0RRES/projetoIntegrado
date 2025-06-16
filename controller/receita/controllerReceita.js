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

const controllerReceitaClassificacao = require('./controllerReceitaClassificacao.js') // Caminho corrigido se estiver na mesma pasta ou similar

//Função para inserir uma nova receita
const inserirReceita = async function(receita, contentType) {
    try {
        if (contentType === 'application/json') {

            // Validar campos principais da receita
            if (
                receita.titulo        === undefined || receita.titulo        === '' || receita.titulo        === null || receita.titulo.length        > 100 ||
                receita.tempo_preparo === undefined || receita.tempo_preparo === '' || receita.tempo_preparo === null || receita.tempo_preparo.length > 10  ||
                receita.foto_receita  === undefined || receita.foto_receita  === '' || receita.foto_receita  === null || receita.foto_receita.length  > 255 ||
                receita.ingrediente   === undefined || receita.ingrediente   === '' ||
                receita.modo_preparo  === undefined || receita.modo_preparo  === '' ||
                receita.dificuldade   === undefined || receita.dificuldade   === '' || receita.dificuldade   === null || receita.dificuldade.length   > 45  ||
                receita.id_usuario    === undefined || receita.id_usuario    === '' || receita.id_usuario    === null || isNaN(receita.id_usuario) || receita.id_usuario <= 0 // Adicionado isNaN
            ) {
                return MESSAGE.ERROR_REQUIRED_FIELDS; // Retorna 400 se algum campo principal estiver faltando
            }

            // Validar se classificacao é um array e não está vazio
            if (!Array.isArray(receita.classificacao) || receita.classificacao.length === 0) {
                return { status_code: 400, message: "É necessário fornecer ao menos uma classificação (ID) para a receita." };
            }

            // Se todas as validações passarem, tenta inserir a receita principal
            let resultReceita = await receitaDAO.insertReceita(receita);

            if (resultReceita && resultReceita.id) {
                const idNovaReceita = resultReceita.id;

                // Itera sobre os OBJETOS de classificação recebidos do frontend
                for (let classificacaoItem of receita.classificacao) { // Renomeado para clareza
                    // Validações adicionais para o objeto de classificação antes de usar
                    if (classificacaoItem.id_classificacao === undefined || 
                        classificacaoItem.id_classificacao === '' || 
                        classificacaoItem.id_classificacao === null || 
                        isNaN(classificacaoItem.id_classificacao) || 
                        classificacaoItem.id_classificacao <= 0) {
                        
                        console.error('ID de classificação inválido recebido:', classificacaoItem);
                        return { status_code: 400, message: "ID de classificação inválido fornecido." };
                    }

                    // **CORREÇÃO AQUI:** Acesse o id_classificacao dentro do objeto
                    const idClassificacaoPuro = classificacaoItem.id_classificacao; 

                    // Constrói o objeto esperado por inserirReceitaClassificacao
                    const classificacaoParaInserir = {
                        id_receita: idNovaReceita,
                        id_classificacao: idClassificacaoPuro // Agora é o ID puro
                    };

                    console.log('Tentando inserir classificação para receita ID:', idNovaReceita, 'e Classificação ID:', idClassificacaoPuro);
                    
                    let resultClassificacao = await controllerReceitaClassificacao.inserirReceitaClassificacao(classificacaoParaInserir, contentType);
                    
                    if (!resultClassificacao || resultClassificacao.status_code !== 201) { 
                        console.error('Erro ao inserir classificação para receita', idNovaReceita, 'com ID de classificação:', idClassificacaoPuro, 'Detalhes:', resultClassificacao);
                        // Você pode adicionar uma lógica para deletar a receita principal aqui se a classificação falhar.
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; 
                    }
                }

                return {
                    status_code: 201,
                    message: 'Receita e classificações criadas com sucesso!',
                    receita: resultReceita
                };
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.error("Erro no controller inserirReceita:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
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
                    // Garante que usuario seja um objeto (primeiro elemento do array, se for array)
                    itemReceita.usuario = dadosUsuario.usuario && dadosUsuario.usuario.length > 0 ? dadosUsuario.usuario[0] : null; 
                    delete itemReceita.id_usuario

                    // Buscar classificações da receita pelo id da receita
                    let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id)

                    // **** AQUI: Configura a saída JSON para as classificações ****
                    if (dadosClassificacao.status && dadosClassificacao.classificacao && dadosClassificacao.classificacao.length > 0) {
                        // Campo "classificacao" como array de objetos {id_classificacao: X}
                        itemReceita.classificacao = dadosClassificacao.classificacao.map(cls => ({
                            id_classificacao: cls.id_classificacao
                        }));
                        // Campo "classificacao_nome" com o nome da primeira classificação
                        itemReceita.classificacao_nome = dadosClassificacao.classificacao[0].nome;
                    } else {
                        itemReceita.classificacao = []; // Garante que a propriedade exista, mesmo vazia
                        itemReceita.classificacao_nome = null; // Se não há classificações, o nome é null
                    }
                    // Remove o campo 'classificacoes' explicitamente, caso ele tenha sido adicionado em algum lugar
                    delete itemReceita.classificacoes; 
                    // **** FIM DA CONFIGURAÇÃO ****

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
        console.error("Erro em listarReceita:", error); // Adicionado log de erro
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
                            // Garante que usuario seja um objeto (primeiro elemento do array, se for array)
                            itemReceita.usuario = dadosUsuario.usuario && dadosUsuario.usuario.length > 0 ? dadosUsuario.usuario[0] : null; 
                            delete itemReceita.id_usuario

                            // Buscar classificações da receita pelo id da receita
                            let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id)

                            // **** AQUI: Configura a saída JSON para as classificações ****
                            if (dadosClassificacao.status && dadosClassificacao.classificacao && dadosClassificacao.classificacao.length > 0) {
                                itemReceita.classificacao = dadosClassificacao.classificacao.map(cls => ({
                                    id_classificacao: cls.id_classificacao
                                }));
                                itemReceita.classificacao_nome = dadosClassificacao.classificacao[0].nome;
                            } else {
                                itemReceita.classificacao = [];
                                itemReceita.classificacao_nome = null;
                            }
                            delete itemReceita.classificacoes; 
                            // **** FIM DA CONFIGURAÇÃO ****

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
        console.error("Erro em buscarReceita:", error); // Adicionado log de erro
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
} 

//Função para retornar todas as receitas com base no nome de um usuário
const listarReceitaByUsername = async function(userName) {
    try {
        const arrayReceitas = []
        let dadosReceitas = {}

        let resultReceita = await receitaDAO.selectByUserName(userName) 


        if(resultReceita != false && typeof(resultReceita) == 'object'){
            if(resultReceita.length > 0){
                dadosReceitas.status = true
                dadosReceitas.status_code = 200
                dadosReceitas.items = arrayReceitas

                for (let itemReceita of resultReceita) {
                    // Buscar o usuário e associar
                    let dadosUsuario = await controllerUsuario.buscarUsuario(itemReceita.id_usuario)
                    // Garante que usuario seja um objeto (primeiro elemento do array, se for array)
                    itemReceita.usuario = dadosUsuario.usuario && dadosUsuario.usuario.length > 0 ? dadosUsuario.usuario[0] : null; 
                    delete itemReceita.id_usuario

                    // Buscar classificações da receita pelo id da receita
                    let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id)

                    // **** AQUI: Configura a saída JSON para as classificações ****
                    if (dadosClassificacao.status && dadosClassificacao.classificacao && dadosClassificacao.classificacao.length > 0) {
                        itemReceita.classificacao = dadosClassificacao.classificacao.map(cls => ({
                            id_classificacao: cls.id_classificacao
                        }));
                        itemReceita.classificacao_nome = dadosClassificacao.classificacao[0].nome;
                    } else {
                        itemReceita.classificacao = [];
                        itemReceita.classificacao_nome = null;
                    }
                    delete itemReceita.classificacoes; 
                    // **** FIM DA CONFIGURAÇÃO ****

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
        console.error("Erro em listarReceitaByUsername:", error); // Adicionado log de erro
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER   
    }
}

// Função para buscar receitas por ID de usuário
const listarReceitasDoUsuario = async function(idUsuario){
    let response = { status: false, status_code: 500, message: "Erro interno do servidor." };

    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        response.status_code = 400;
        response.message = "ID do usuário inválido.";
        return response;
    }

    try {
        let receitas = await receitaDAO.selectReceitasByUsuarioId(Number(idUsuario));

        if (receitas) { 
            const receitasComDetalhes = [];
            for (let itemReceita of receitas) {
                // Buscar o usuário e associar
                let dadosUsuario = await controllerUsuario.buscarUsuario(itemReceita.id_usuario);
                // Garante que usuario seja um objeto (primeiro elemento do array, se for array)
                itemReceita.usuario = dadosUsuario.usuario && dadosUsuario.usuario.length > 0 ? dadosUsuario.usuario[0] : null; 
                delete itemReceita.id_usuario; 

                // Buscar classificações da receita pelo id da receita
                let dadosClassificacao = await controllerReceitaClassificacao.buscarClassificacaoPorReceita(itemReceita.id);
                
                // **** AQUI: Configura a saída JSON para as classificações ****
                if (dadosClassificacao.status && dadosClassificacao.classificacao && dadosClassificacao.classificacao.length > 0) {
                    itemReceita.classificacao = dadosClassificacao.classificacao.map(cls => ({
                        id_classificacao: cls.id_classificacao 
                    }));
                    itemReceita.classificacao_nome = dadosClassificacao.classificacao[0].nome;
                } else {
                    itemReceita.classificacao = []; 
                    itemReceita.classificacao_nome = null;
                }
                delete itemReceita.classificacoes; 
                // **** FIM DA CONFIGURAÇÃO ****

                receitasComDetalhes.push(itemReceita);
            }

            response.status = true;
            response.status_code = 200;
            response.message = "Receitas do usuário encontradas com sucesso.";
            response.receitasPublicadas = receitasComDetalhes;
        } else { 
            response.status_code = 404;
            response.message = "Nenhuma receita encontrada para este usuário ou erro na consulta.";
        }
        return response;
    } catch (error) {
        console.error("Erro no controller ao listar receitas por ID de usuário:", error);
        return response;
    }
}

module.exports = {
    inserirReceita,
    atualizarReceita,
    excluirReceita,
    listarReceita,
    buscarReceita,
    listarReceitaByUsername,
    listarReceitasDoUsuario
}