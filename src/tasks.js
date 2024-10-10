const jwt = require('jsonwebtoken');
const fs = require('fs');

var tasks = JSON.parse(fs.readFileSync('DB/tarefas.json', 'utf-8'));

function exibir(req, res) {

}

function criar(req, res) {

}

function deletar(req, res) {

}

function alterar_task(req, res) {

}

module.exports = { exibir, criar, deletar, alterar_task }