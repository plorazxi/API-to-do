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

function criar(req, res) {
}

function deletar(req, res) {
}

function alterar_task(req, res) {
}

module.exports = { exibir, criar, deletar, alterar_task }