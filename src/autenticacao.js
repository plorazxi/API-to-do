const jwt = require('jsonwebtoken');
const bc = require('bcrypt');
const { randomInt } = require('node:crypto');
const fs = require('fs');

function lerDB() {
    fs.readFile('../DB/Usuários.json', 'utf-8', (err, data) => {
        if(err) {
            //tratamento de erro: erro de leitura do DB
        } else {
            try {
                const dados = JSON.parse(data);
                return dados;
            } catch(err) {
                //tratamento de erro: erro ao transformar em json
            }
        }
    });
}

function login(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;
    const usuarios = lerDB();

}

function register(req, res) {

}

module.exports = { login, register };