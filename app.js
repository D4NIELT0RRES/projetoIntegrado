/**************************************************************************
 * OBJETIVO: API referente ao projeto de gestão de receitas
 * DATA: 20/05/2025
 * AUTOR: DANIEL TORRES
 * VERSÃO: 1.0
 *************************************************************************/

//Import das bibliotecas para criar a API
const express    = require('express')
const cors       = require('cors')
const bodyParser = require('body-parser')

//Import das controllers para realizar o CRUD de dados
const controllerUsuario = require('./controller/usuario/controllerUsuario.js')

//Estabelecendo o formato de dados que deverá chegar no body da aquisição (POST ou PUT)
const bodyParserJson = bodyParser.json()

//Cria o objeto app para criar a API
const app = express()

//Configuração do cors   
app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    app.use(cors())
    next()
})

/**************************************************************************************************/

//EndPoint para inserir um usuário no banco de dados 
app.post('/v1/controle-receita/usuario', cors(), bodyParserJson, async function (request,response){

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminha os dados do body da requisição para a controller inserir no banco de dados
    let resultUsuario = await controllerUsuario.inserirUsuario(dadosBody,contentType)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})