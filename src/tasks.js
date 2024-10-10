const jwt = require('jsonwebtoken');
const fs = require('fs');

var tasks = JSON.parse(fs.readFileSync('DB/tarefas.json', 'utf-8'));

/**
 * Função para exibir todas as tarefas de um usuário através do token
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
*/

function exibir(req, res) {
    const { token } = req.params;
    const user = jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if(err) {
            res.status(401).send({msg: "Token inválido"});
            return false;
        } else {
            return decoded;
        }
    });
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
    const id = tasks.length + 1;
    const user = jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if(err) {
            res.status(401).send({msg: "Token inválido"});
            return false;
        } else {
            return decoded;
        }
    });
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

function deletar(req, res) {
}

function alterar_task(req, res) {
}

module.exports = { exibir, criar, deletar, alterar_task }