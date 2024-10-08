const jwt = require('jsonwebtoken');
const bc = require('bcrypt');
const { randomInt } = require('node:crypto');
const fs = require('fs');

// Cria um variavel com todas as informações do "Banco de dados"
var users = JSON.parse(fs.readFileSync('DB/users.json', 'utf-8'));

async function login(req, res) {
    // Pegando o email e a senha enviada para realizar o login
    const { email, senha } = req.body;
    // Filtra todos os usuários com o mesmo email : retorna uma lista
    const result = users.filter((user) => {
        if(user.email==email) return user;
    });
    if(result.length>1) { // Se tiver o mesmo email para mais usuários: (falha no banco de dados, não pode)
        res.status(506).send({erro: "banco de dados com falhas"});
        return ;
    } else if(result.length==0) { // Se não encontrar um usuário cadastado com este email:
        res.status(401).send({erro: "email invalido"});
        return ;
    }
    // Criando o objeto usuário (era uma lista)
    const user = result[0];
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
            token: token
        });
    } else { // Se a senha estiver incorreta
        res.status(401).send({erro: "senha invalida"});
        return ;
    }
}

async function register(req, res) {
    // Gerando o id
    const id = users.length + 1;
    // Pegando os dados do corpo da requisição
    const { nome, email, data_nascimento, senha } = req.body;
    // Filtra os emails dos usuários : retorna uma lista
    const ver_email = users.filter((user) => {
        if(user.email == email) return user;
    });
    if(ver_email.length != 0) { // Se o email já estiver sendo utilizado
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
        token: token
    });
}

async function mudar(req, res) {
    // Pegando os dados da requisição (tributo é o que vai mudar, do body são informações necessárias)
    const { tributo } = req.params;
    const { nome, email, data_nascimento, senha } = req.body;
    // Filtrando os usuario..
    const result = users.filter((user) => {
        if(tributo == 'email') { // Por nome e data de nascimento (caso ele deseje mudar o email)
            if(user.nome == nome && user.data_nascimento == data_nascimento) return user;
        } else { // Pelo email
            if(user.email == email) return user;
        }
    });
    if(result.length>1) { // Se encontrar mais de um usuário no BD
        res.status(506).send({erro: "banco de dados com falhas"});
        return ;
    } else if(result.length==0) { // Se não encontrar o usuário
        res.status(404).send({erro: "usuário não encontrado"});
        return ;
    }
    // Pegando o endereço do usuário na lista
    const index = result[0].id - 1;
    // Fazendo a alteração na variavel users
    if(tributo == 'senha') {
        // Criando o hash da senha
        let hash = await bc.hash(senha, randomInt(10, 16));
        users[index].senha = hash;
    } else if(tributo == 'email') {
        // Verificando o se o email ja está sendo utilizado
        const ver_email = users.filter((user) => {
            if(user.email == email) return user;
        });
        if(ver_email.length != 0) {
            res.status(401).send({erro: "email sendo utilizado"});
            return ;
        } else {
            users[index].email = email;
        }
    } else if(tributo == 'data_nascimento') {
        users[index].data_nascimento = data_nascimento;
    } else if(tributo == 'nome') {
        users[index].nome = nome;
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