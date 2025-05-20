/**************************************************************************
 * OBJETIVO: Arquivo de padronização de mensagem e status code para projeto
 * DATA: 20/05/2025
 * AUTOR: DANIEL TORRES
 * VERSÃO: 1.0
 *************************************************************************/

/**********************MENSAGENS DE ERRO***********************/

const ERROR_REQUIRED_FIELDS            = {status: false, status_code:400, message:'Exixstem campos obrigatórios que não foram preenchidos ou ultrapassaram a quantidade de caracteres. A requisição não pode ser realizada !!'}
const ERROR_INTERNAL_SERVER_CONTROLLER = {status: false, status_code:500, message:'Não foi possível processar a requisição pois ocorreram erros internos no servidor da CONTROLLER !!'}
const ERROR_INTERNAL_SERVER_MODEL      = {status: false, status_code:500, message:'Não foi possível processar a requisição pois ocorreram erros internos no servidor da MODEL !!'}
const ERROR_CONTENT_TYPE               = {status: false, status_code:415, message:'Não foi possível processar a requisição pois o formato de dados encaminhado não é suportado pelo servidor.Favor encaminhar apenas JSON !!'}
const ERROR_NOT_FOUND                  = {status: false, status_code:404, message:'Não foram encontrados itens para retornar!!'}


/**********************MENSAGENS DE SUCESSO***********************/

const SUCCESS_CREATED_ITEM = {status: true, status_code:201, message:'Item criado com sucesso'}
const SUCCESS_DELETE_ITEM = {status: true, status_code:200, message:'Item removido com sucesso'}
const SUCCESS_UPDATE_ITEM = {status: true, status_code:200, message:'Item atualizado com sucesso'}






module.exports = {
    ERROR_REQUIRED_FIELDS,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    SUCCESS_CREATED_ITEM,
    SUCCESS_DELETE_ITEM,
    SUCCESS_UPDATE_ITEM
}