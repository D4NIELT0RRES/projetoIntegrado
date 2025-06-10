/*************************************************************************************************
 * OBJETIVO: API referente ao projeto de GESTÃO DE RECEITAS
 * DATA: 22/05/2025
 * AUTOR: DANIEL TORRES
 * VERSÃO: 1.0
 *================================================================================================ 
 * 
 * 
 * OBSERVAÇÃO:
 * 
 * ****************** Para configurar e instalar a API, precisamos das seguites bibliotecas:
 *                      -> express          npm install express --save
 *                      -> cors             npm install cors --save
 *                      -> body-parser      npm install body-parser --save
 * 
 * ****************** Para configurar e Instalar o acesso remoto ao Banco de Dados precisamos:
 *                      -> prisma          npm install prisma --save (conexão com o BD)
 *                      -> prisma/client   npm install @prisma/client --save (Executa scrips no BD)
 * 
 * 
 * ******************* Após a instalação do prisma e do prisma/client, devemos:
 * 
 *                     npx prisma init (Inicializar o prisma no projeto)
 * 
 * ******************* Para realizar o sincronismo do prisma com o BD, devemos executar o seguinte comando:
 * 
 *                     npx prisma migrate dev                   
 * 
 *************************************************************************************************/

//Import das bibliotecas para criar a API
const express    = require('express')
const cors       = require('cors')
const bodyParser = require('body-parser')

//Import das controllers para realizar o CRUD de dados
const controllerUsuario      = require('./controller/usuario/controllerUsuario.js')
const controllerReceita      = require('./controller/receita/controllerReceita.js')
const controllerClassificacao = require('./controller/classificacao/controllerClassificacao.js')

//Estabelecendo o formato de dados que deverá chegar no body da aquisição (POST ou PUT)
const bodyParserJson = bodyParser.json()

//Cria o objeto app para criar a API
const app = express()

//Configuração do cors   
app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    app.use(cors())
    app.use(express.json())
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

//EndPoint para listar usuário no banco de dados 
app.get('/v1/controle-receita/usuario', cors(), bodyParserJson, async function (request, response) {
    
    let resultUsuario = await controllerUsuario.listarUsuario()

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//EndPoint para retornar um usuário pelo ID
app.get('/v1/controle-receita/usuario/:id', cors(), async function (request,response) {
    
    let idUsuario = request.params.id
    let resultUsuario = await controllerUsuario.buscarUsuario(idUsuario)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)

})

//EndPoint para retornar um usuário pelo NOME
app.get('/v1/controle-receita/usuario/:nome', cors(), async function (request,response){

    let nomeUsuario = request.params.nome
    let resultUsuario = await controllerUsuario.buscarUsuarioPorNome(nomeUsuario)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//EndPoint para deletar um usuário pelo ID
app.delete('/v1/controle-receita/usuario/:id', cors(), async function (request,response) {
    
    let idUsuario = request.params.id
    let resultUsuario = await controllerUsuario.excluirUsuario(idUsuario)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//EndPoint para atualizar um usuário pelo ID
app.put('/v1/controle-receita/usuario/:id', cors(), bodyParserJson, async function (request,response){

   let contentType = request.headers['content-type']
   let idUsuario = request.params.id
   let dadosBody = request.body

   let resultUsuario = await controllerUsuario.atualizarUsuario(dadosBody,idUsuario,contentType)

   response.status(resultUsuario.status_code)
   response.json(resultUsuario)
    
})

//EndPoint para atualizar a senha pelo email e a palavra chave
app.put('/v1/controle-receita/usuario', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body;

    let resultUsuario = await controllerUsuario.atualizarSenha(dadosBody);

    response.status(resultUsuario.status_code);
    response.json(resultUsuario);
});

//Endpoint para trazer um usuario através do login 
app.post('/v1/controle-receita/login', cors(), bodyParserJson, async function (request,response){

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminha os dados do body da requisição para a controller inserir no banco de dados
    let resultLogin = await controllerUsuario.loginUsuario(dadosBody,contentType)
    response.status(resultLogin.status_code)
    response.json(resultLogin)
})

/******************************************************************************************************************/

// Endpoint para inserir uma receita
app.post('/v1/controle-receita/receita', cors(), bodyParserJson, async function (request, response) {

    // Recebe o content-type da requisição (application/json, por exemplo)
    let contentType = request.headers['content-type'];

    // Recebe os dados do body (campos de texto, incluindo a URL da imagem)
    let dadosBody = request.body

    // Chama a controller para inserir a receita com os dados recebidos
    let resultReceita = await controllerReceita.inserirReceita(dadosBody, contentType);

    response.status(resultReceita.status_code);
    response.json(resultReceita);
});



//EndPoint para listar receita no banco de dados 
app.get('/v1/controle-receita/receita', cors(), bodyParserJson, async function (request, response) {
    
    let resultReceita = await controllerReceita.listarReceita()

    response.status(resultReceita.status_code)
    response.json(resultReceita)
})

//EndPoint para retornar uma receita com base no nome de usuário
app.get('/v1/controle-receita/receita/:username', cors(), async function (request,response) {
    
    let userName = request.params.username
    let resultReceita = await controllerReceita.listarReceitaByUsername(userName)

    response.status(resultReceita.status_code)
    response.json(resultReceita)

})

//EndPoint para retornar um usuário pelo ID
app.get('/v1/controle-receita/receita/:id', cors(), async function (request,response) {
    
    let idReceita = request.params.id
    let resultReceita = await controllerReceita.buscarReceita(idReceita)

    response.status(resultReceita.status_code)
    response.json(resultReceita)

})

//EndPoint para deletar uma receita pelo ID
app.delete('/v1/controle-receita/receita/:id', cors(), async function (request,response) {
    
    let idReceita = request.params.id
    let resultReceita = await controllerReceita.excluirReceita(idReceita)

    response.status(resultReceita.status_code)
    response.json(resultReceita)
})

//EndPoint para atualizar uma receita pelo ID
app.put('/v1/controle-receita/receita/:id', cors(), bodyParserJson, async function (request,response){

    let contentType = request.headers['content-type']
    let idReceita = request.params.id
    let dadosBody = request.body
 
    let resultReceita = await controllerReceita.atualizarReceita(dadosBody,idReceita,contentType)
 
    response.status(resultReceita.status_code)
    response.json(resultReceita)
     
})

/******************************************************************************************************************/

//EndPoint para inserir uma classificacao no banco de dados 
app.post('/v1/controle-receita/classificacao', cors(), bodyParserJson, async function (request,response){

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminha os dados do body da requisição para a controller inserir no banco de dados
    let resultClassificacao = await controllerClassificacao.inserirClassificacao(dadosBody,contentType)

    response.status(resultClassificacao.status_code)
    response.json(resultClassificacao)
})

//EndPoint para listar classificacao no banco de dados 
app.get('/v1/controle-receita/classificacao', cors(), bodyParserJson, async function (request, response) {
    
    let resultClassificacao = await controllerClassificacao.listarClassificacao()

    response.status(resultClassificacao.status_code)
    response.json(resultClassificacao)
})

//EndPoint para retornar uma classificacao pelo ID
app.get('/v1/controle-receita/classificacao/:id', cors(), async function (request,response) {
    
    let idClassificacao = request.params.id
    let resultClassificacao = await controllerClassificacao.buscarClassificacao(idClassificacao)

    response.status(resultClassificacao.status_code)
    response.json(resultClassificacao)

})

//EndPoint para retornar uma classficacao pelo NOME
app.get('/v1/controle-receita/classificacao/:nome', cors(), async function (request,response){

    let nomeClassificacao = request.params.nome
    let resultClassificacao = await controllerClassificacao.buscarClassificacao(nomeClassificacao)

    response.status(resultClassificacao.status_code)
    response.json(resultClassificacao)
})

//EndPoint para deletar uma classificacao pelo ID
app.delete('/v1/controle-receita/classificacao/:id', cors(), async function (request,response) {
    
    let idClassificacao = request.params.id
    let resultClassificacao = await controllerClassificacao.excluirClassificacao(idClassificacao)

    response.status(resultClassificacao.status_code)
    response.json(resultClassificacao)
})

//EndPoint para atualizar uma classificacao pelo ID
app.put('/v1/controle-receita/classificacao/:id', cors(), bodyParserJson, async function (request,response){

   let contentType = request.headers['content-type']
   let idUsuario = request.params.id
   let dadosBody = request.body

   let resultClassificacao = await controllerClassificacao.atualizarClassificacao(dadosBody,idUsuario,contentType)

   response.status(resultClassificacao.status_code)
   response.json(resultClassificacao)
    
})


app.listen('8080', function(){
    console.log('API aguardando Requisições...')
})