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
            token: token
        });
    } else {
        res.status(401).send({erro: "senha invalida"});
        return ;
    }
}

function register(req, res) {

}

module.exports = { login, register };