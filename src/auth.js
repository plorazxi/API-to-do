const jwt = require('jsonwebtoken');
const bc = require('bcrypt');
const { randomInt } = require('node:crypto');
const fs = require('fs');

var users = JSON.parse(fs.readFileSync('DB/users.json', 'utf-8'));

async function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;
    const result = users.filter((user) => {
        if(user.email==email) return user;
    });
    if(result.length>1) {
        res.status(506).send({erro: "banco de dados com falhas"});
        return ;
    } else if(result.length==0) {
        res.status(401).send({erro: "email invalido"});
        return ;
    }
    const user = result[0];
    if(await bc.compare(senha, user.senha)) {
        let payload = {
            nome: user.nome,
            email: user.email,
            senha: user.senha
        }
        let token = jwt.sign(payload, process.env.SECRETKEY, {
            algorithm: 'HS256',
            expiresIn: '1h'
        });
        res.send({
            msg: "login realizado com sucesso",
            token: token
        });
    } else {
        res.status(401).send({erro: "senha invalida"});
        return ;
    }
}

async function register(req, res) {
    const id = users.length + 1;
    const { nome, email, data_nascimento, senha } = req.body;
    const ver_email = users.filter((user) => {
        if(user.email == email) return user;
    });
    if(ver_email.length != 0) {
        res.status(401).send({erro: "email sendo utilizado"});
        return ;
    }
    const senha_hash = await bc.hash(senha, randomInt(10, 16));
    const cadastro = {
        id: id,
        nome: nome,
        email: email,
        data_nascimento: data_nascimento,
        senha: senha_hash
    };
    users.push(cadastro);
    fs.writeFile('DB/users.json', JSON.stringify(users), (err) => {
        if(err) {
            res.status(506).send({erro: "banco de dados com falhas"});
            return ;
        }
    });
    let payload = {
        nome: nome,
        email: email,
        senha: senha_hash
    };
    let token = jwt.sign(payload, process.env.SECRETKEY, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    res.send({
        msg: "cadastro realizado com sucesso",
        token: token
    });
}

module.exports = { login, register };