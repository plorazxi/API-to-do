const jwt = require('jsonwebtoken');
const bc = require('bcrypt');
const { randomInt } = require('node:crypto');
const fs = require('fs');
const { gerarID, ver_email, proc_user_byName, proc_user_byEmail } = require('./global_fct');

// Cria um variavel com todas as informações do "Banco de dados"
var users = JSON.parse(fs.readFileSync('DB/users.json', 'utf-8'));

/**
 * Função para a realização do login e produção do token
 * @param {Request} req - Request da rota
 * @param {Response} res - Reponse da rota
 * @returns void
*/

async function login(req, res) {
    // Pegando o email e a senha enviada para realizar o login
    const { email, senha } = req.body;
    // Procurando o usuário pelo email
    const user = proc_user_byEmail(users, email, res);
    if(!user) return;
    if(await bc.compare(senha, user.senha)) { // Se a senha estiver correta
        // Criação do payload
        let payload = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            senha: user.senha
        }
        // Assinatura do payload
        let token = jwt.sign(payload, process.env.SECRETKEY, {
            algorithm: 'HS256',
            expiresIn: '1h'
        });
        // Retornando a assinatura com uma mensagem
        res.send({
            msg: "login realizado com sucesso",
            nome: user.nome,
            token: token
        });
    } else { // Se a senha estiver incorreta
        res.status(401).send({erro: "senha invalida"});
        return ;
    }
}

/**
 * Função para o registro, adicionar usuário no "banco de dados"
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
 * @returns void
*/

async function register(req, res) {
    // Gerando o id
    const id = gerarID(users);
    // Pegando os dados do corpo da requisição
    const { nome, email, data_nascimento, senha } = req.body;
    // Verifica se o email está sendo utilizado
    if(ver_email(users, email)) {
        res.status(401).send({erro: "email sendo utilizado"});
        return ;
    }
    // Cria o hash da senha
    const senha_hash = await bc.hash(senha, randomInt(10, 16));
    // Cria o objeto para implementar no "Banco de dados"
    const cadastro = {
        id: id,
        nome: nome,
        email: email,
        data_nascimento: data_nascimento,
        senha: senha_hash
    };
    // Inclementa na variavel e escreve no arquivo json
    users.push(cadastro);
    fs.writeFile('DB/users.json', JSON.stringify(users), (err) => {
        if(err) {
            res.status(506).send({erro: "banco de dados com falhas"});
            return ;
        }
    });
    // Criação do payload
    let payload = {
        id: id,
        nome: nome,
        email: email,
        senha: senha_hash
    };
    // Assina o payload
    let token = jwt.sign(payload, process.env.SECRETKEY, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    // envia o token junto com uma mensagem
    res.send({
        msg: "cadastro realizado com sucesso",
        nome: nome,
        token: token
    });
}

/**
 * Função para modificar qualquer tributo no "banco de dados"
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
 * @returns void
*/

async function mudar(req, res) {
    // Pegando os dados da requisição (tributo é o que vai mudar, do body são informações necessárias)
    const { tributo } = req.params;
    const { nome, email, data_nascimento, senha } = req.body;
    let user;
    // procurando usuário..
    if(tributo == 'email') user = proc_user_byName(users, nome, data_nascimento, res);
    else user = proc_user_byEmail(users, email, res);
    if(!user) return ;
    // Pegando o endereço do usuário na lista
    const index = users.indexOf(user);
    // Fazendo a alteração na variavel users
    if(tributo == 'senha') {
        if(!senha) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        }
        // Criando o hash da senha
        let hash = await bc.hash(senha, randomInt(10, 16));
        users[index].senha = hash;
    } else if(tributo == 'email') {
        if(!email) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        }
        if(ver_email(users, email)) {
            res.status(401).send({erro: "email sendo utilizado"});
            return ;
        } else users[index].email = email;
    } else if(tributo == 'data_nascimento') {
        if(!data_nascimento) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        } else users[index].data_nascimento = data_nascimento;
    } else if(tributo == 'nome') {
        if(!nome) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        } else users[index].nome = nome;
    } else { // Se o tributo não for um dado do objeto
        res.status(400).send({erro: "tributo irreconhecível"});
    }
    // Escrevendo a nova lista no arquivo json
    fs.writeFile('DB/users.json', JSON.stringify(users), (err) => {
        if(err) {
            res.status(506).send({erro: "banco de dados com falhas"});
            return ;
        }
    });
    // Retornando uma mensagem de sucesso
    res.send({msg: "banco de dados atualizado com sucesso"});
}

module.exports = { login, register, mudar };