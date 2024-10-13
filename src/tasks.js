const jwt = require('jsonwebtoken');
const fs = require('fs');
const { gerarID, ver_token } = require('./global_fct');

var tasks = JSON.parse(fs.readFileSync('DB/tarefas.json', 'utf-8'));

/**
 * Função para exibir todas as tarefas de um usuário através do token
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
*/

function exibir(req, res) {
    const { token } = req.params;
    const user = ver_token(token, res);
    if(user == false) return;
    let own_tasks = tasks.filter((task) => {
        if(task.id_dono == user.id) return user;
    });
    res.send(own_tasks);
}

/**
 * Função para criar tarefas de um usuário através do token
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
*/

function criar(req, res) {
    const { token, titulo, subtitulo, data_criacao } = req.body;
    const id = gerarID(tasks);
    const user = ver_token(token, res);
    if(user == false) return;
    let task = {
        id: id,
        id_dono: user.id,
        titulo: titulo,
        subtitulo: subtitulo,
        data_criacao: data_criacao || Date.now(),
        ja_feita: false
    };
    tasks.push(task);
    fs.writeFile('DB/tarefas.json', JSON.stringify(tasks), (err) => {
        if(err) {
            res.status(506).send({erro: "banco de dados com falhas"});
            return ;
        } else {
            res.send({msg: "Tarefa criada com sucesso"});
        }
    });
}

/**
 * Função para deletar alguma task dentro do "Banco de dados"
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
*/

function deletar(req, res) {
    const { id, token } = req.body;
    const user = ver_token(token, res);
    if (user == false) return;
    const result = tasks.filter((task) => {
        if(task.id == id) return task;
    });
    if(result.length>1) { 
        res.status(506).send({erro: "banco de dados com falhas"});
        return ;
    } else if(result.length==0) { 
        res.status(400).send({erro: "id de task invalida"});
        return ;
    }
    const task = result[0];
    if (task.id_dono != user.id) {
        res.status(401).send({msg: "Usuário inválido"});
        return ;
    }
    const index = tasks.indexOf(task);
    tasks.splice(index);
    fs.writeFile('DB/tarefas.json', JSON.stringify(tasks), (err) => {
        if(err) {
            res.status(506).send({msg: "banco de dados com falhas"});
            return ;
        } else {
            res.send({msg: "tarefa excluida com sucesso"});
        }
    });
}

function alterar_task(req, res) {
}

module.exports = { exibir, criar, deletar, alterar_task }