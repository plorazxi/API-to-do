const fs = require('fs');
const { gerarID, ver_token, proc_task } = require('./global_fct');

var tasks = JSON.parse(fs.readFileSync('DB/tarefas.json', 'utf-8'));

/**
 * Função para exibir todas as tarefas de um usuário através do token
 * @param {Request} req - Request da rota
 * @param {Response} res - Response da rota
*/

function exibir(req, res) {
    // Pega e valida o token
    const { token } = req.params;
    const user = ver_token(token, res);
    if(!user) return;
    // Cria lista com as tasks do user e as envia
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
    // Gera ID e valida token
    const id = gerarID(tasks);
    const user = ver_token(token, res);
    if(!user) return;
    // Cria um objeto task, insere em tasks e transcreve no arquivo json
    let task = {
        id: id,
        id_dono: user.id,
        titulo: titulo,
        subtitulo: subtitulo,
        data_criacao: data_criacao || Date.now(),
        status: false
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
    // Valida token e procura task através do ID
    const user = ver_token(token, res);
    if(!user) return;
    const task = proc_task(tasks, id, res);
    if(!task) return;
    // Verifica se o user é dono da task
    if (task.id_dono != user.id) {
        res.status(401).send({msg: "Usuário inválido"});
        return ;
    }
    //Pega o endereço da task, exclui e reescreve o arquivo json
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

/**
 * Função para alterar qualquer valor da tarefa
 * @param {Request} req - Request da rota
 * @param {Response} res - Reponse da rota
*/

function alterar_task(req, res) {
    const { tributo } = req.params;
    const { id, titulo, subtitulo, status, token } = req.body;
    // Valida token, procura task e verifica se o user é dono da task
    const user = ver_token(token, res);
    if(!user) return;
    const task = proc_task(tasks, id, res);
    if(!task) return;
    if(task.id_dono != user.id) {
        res.status(401).send({msg: "Usuário inválido"});
        return;
    }
    // Pega endereço da task e verifica um a um o tributo para alterar
    const index = tasks.indexOf(task);
    if(tributo == 'titulo') {
        if(!titulo) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        } else tasks[index].titulo = titulo;
    }
    else if(tributo == 'subtitulo') {
        if(!subtitulo) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        } else tasks[index].subtitulo = subtitulo;
    }
    else if(tributo == 'status') {
        if(!status) {
            res.status(400).send({msg: "tributo não enviado no corpo da requisição"});
            return ;
        } else tasks[index].status = status;
    }
    else { // Caso o tributo não seja reconhecido
        res.status(400).send({msg: "tributo irreconhecível"});
        return;
    }
    // Reescreve no arquivo json
    fs.writeFile('DB/tarefas.json', JSON.stringify(tasks), (err) => {
        if(err) {
            res.status(506).send({erro: "banco de dados com falhas"});
            return;
        } else res.send({msg: "Tarefa atualizada com sucesso"});
    });
}

module.exports = { exibir, criar, deletar, alterar_task }