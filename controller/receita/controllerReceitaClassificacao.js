/***************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio do CRUD da ReceitaClassificacao.
 * DATA: 21/05/2025
 * AUTOR: Daniel Torres
 * Versão: 1.0
 ***************************************************************************************/

// Import do arquivo de mensagens e status code do projeto
const MESSAGE = require('../../modulo/config.js');

const receitaClassificacaoDAO = require('../../model/DAO/receitaClassificacao.js');

const inserirReceitaClassificacao = async function (receitaClassificacao, contentType) {
    try {
        if (contentType === 'application/json') {
            if (
                receitaClassificacao.id_receita == undefined || receitaClassificacao.id_receita == '' || receitaClassificacao.id_receita == null || isNaN(receitaClassificacao.id_receita) || receitaClassificacao.id_receita <= 0 ||
                receitaClassificacao.id_classificacao == undefined || receitaClassificacao.id_classificacao == '' || receitaClassificacao.id_classificacao == null || isNaN(receitaClassificacao.id_classificacao) || receitaClassificacao.id_classificacao <= 0
            ) {
                return MESSAGE.ERROR_REQUIRED_FIELDS; //400
            } else {
                // Chama a função do DAO para inserir no banco de dados
                let resultReceitaClassificacaoDAO = await receitaClassificacaoDAO.insertReceitaClassificacao(receitaClassificacao);

                if (resultReceitaClassificacaoDAO) {
                    return MESSAGE.SUCCESS_CREATED_ITEM; //201
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
                }
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE; //415
        }
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.inserirReceitaClassificacao:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
};

const atualizarReceitaClassificacao = async function (id, receitaClassificacao, contentType) {
    try {
        if (contentType === 'application/json') {
            if (
                receitaClassificacao.id_receita == undefined || receitaClassificacao.id_receita == '' || receitaClassificacao.id_receita == null || isNaN(receitaClassificacao.id_receita) || receitaClassificacao.id_receita <= 0 ||
                receitaClassificacao.id_classificacao == undefined || receitaClassificacao.id_classificacao == '' || receitaClassificacao.id_classificacao == null || isNaN(receitaClassificacao.id_classificacao) || receitaClassificacao.id_classificacao <= 0 ||
                id == undefined || id == '' || id == null || isNaN(id) || id <= 0
            ) {
                return MESSAGE.ERROR_REQUIRED_FIELDS; //400
            } else {
                let resultReceitaClassificacao = await receitaClassificacaoDAO.selectByIdReceitaClassificacao(parseInt(id));

                if (resultReceitaClassificacao !== false && typeof(resultReceitaClassificacao) === 'object' && resultReceitaClassificacao.length > 0) {
                    receitaClassificacao.id = parseInt(id);

                    let result = await receitaClassificacaoDAO.updateReceitaClassificacao(receitaClassificacao);

                    if (result) {
                        return MESSAGE.SUCCESS_UPDATE_ITEM; //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
                    }
                } else if (resultReceitaClassificacao.length === 0) {
                    return MESSAGE.ERROR_NOT_FOUND; //404
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
                }
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE; //415
        }
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.atualizarReceitaClassificacao:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
};

const excluirReceitaClassificacao = async function (id) {
    try {
        if (id == undefined || id == '' || id == null || isNaN(id) || id <= 0) {
            return MESSAGE.ERROR_REQUIRED_FIELDS; //400
        } else {
            let resultReceitaClassificacao = await receitaClassificacaoDAO.selectByIdReceitaClassificacao(parseInt(id));

            if (resultReceitaClassificacao !== false && typeof(resultReceitaClassificacao) === 'object' && resultReceitaClassificacao.length > 0) {
                let result = await receitaClassificacaoDAO.deleteReceitaClassificacao(parseInt(id));

                if (result) {
                    return MESSAGE.SUCCESS_DELETE_ITEM; //200
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
                }
            } else if (resultReceitaClassificacao.length === 0) {
                return MESSAGE.ERROR_NOT_FOUND; //404
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
            }
        }
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.excluirReceitaClassificacao:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
};

// Nova função para deletar classificações por ID de Receita
const deletarClassificacaoPorReceita = async function(idReceita) {
    try {
        if (idReceita == undefined || idReceita == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            return MESSAGE.ERROR_REQUIRED_FIELDS; //400
        } else {
            // Assumindo que o DAO tem uma função para deletar por id_receita
            let result = await receitaClassificacaoDAO.deleteByReceitaId(parseInt(idReceita)); 
            
            if (result) {
                return { status_code: 200, message: "Classificações da receita excluídas com sucesso." };
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
            }
        }
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.deletarClassificacaoPorReceita:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};

const listarReceitaClassificacao = async function () {
    try {
       let dadosReceitaClassificacao = {};

       let resultReceitaClassificacao = await receitaClassificacaoDAO.selectAllReceitaClassificacao();

       if (resultReceitaClassificacao !== false && typeof(resultReceitaClassificacao) === 'object' && resultReceitaClassificacao.length > 0) {
            dadosReceitaClassificacao.status = true;
            dadosReceitaClassificacao.status_code = 200;
            dadosReceitaClassificacao.items = resultReceitaClassificacao.length;
            dadosReceitaClassificacao.receita_classificacao = resultReceitaClassificacao;

            return dadosReceitaClassificacao; //200
       } else if (resultReceitaClassificacao.length === 0) {
            return MESSAGE.ERROR_NOT_FOUND; //404
       } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
       }
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.listarReceitaClassificacao:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
};

const buscarClassificacaoPorReceita = async function (idReceita) {
    try {
        if (idReceita == undefined || idReceita == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            return MESSAGE.ERROR_REQUIRED_FIELDS; //400
        } else {
            let dadosClassificacaoPorReceita = {};

            // Chamada ao DAO para buscar as classificações da receita
            let resultClassificacaoPorReceita = await receitaClassificacaoDAO.selectClassificacaoByIdReceita(parseInt(idReceita));

            if (resultClassificacaoPorReceita !== false && typeof(resultClassificacaoPorReceita) === 'object' && resultClassificacaoPorReceita.length > 0) {
                dadosClassificacaoPorReceita.status = true;
                dadosClassificacaoPorReceita.status_code = 200;
                dadosClassificacaoPorReceita.classificacao = resultClassificacaoPorReceita; // O campo 'classificacao' agora contém a lista de objetos {id_classificacao, nome}

                return dadosClassificacaoPorReceita; //200
            } else if (resultClassificacaoPorReceita.length === 0) {
                return MESSAGE.ERROR_NOT_FOUND; //404
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
            }
        }
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.buscarClassificacaoPorReceita:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
};

const buscarReceitaClassificacao = async function (idClassificacao) {
    try {
        if (idClassificacao == undefined || idClassificacao == '' || idClassificacao == null || isNaN(idClassificacao) || idClassificacao <= 0) {
            return MESSAGE.ERROR_REQUIRED_FIELDS; //400
        } else {
            let dadosReceitaClassificacao = {};

            let resultReceitaClassificacao = await receitaClassificacaoDAO.selectReceitaByIdClassificacao(parseInt(idClassificacao));

            if (resultReceitaClassificacao !== false && typeof(resultReceitaClassificacao) === 'object' && resultReceitaClassificacao.length > 0) {
                dadosReceitaClassificacao.status = true;
                dadosReceitaClassificacao.status_code = 200;
                dadosReceitaClassificacao.receita = resultReceitaClassificacao;

                return dadosReceitaClassificacao; //200
            } else if (resultReceitaClassificacao.length === 0) {
                return MESSAGE.ERROR_NOT_FOUND; //404
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
            }
        }    
    } catch (error) {
        console.error("Erro no controllerReceitaClassificacao.buscarReceitaClassificacao:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
};

module.exports = {
    inserirReceitaClassificacao,
    atualizarReceitaClassificacao,
    excluirReceitaClassificacao,
    deletarClassificacaoPorReceita, // Adicionada esta função
    listarReceitaClassificacao,
    buscarClassificacaoPorReceita,
    buscarReceitaClassificacao
};