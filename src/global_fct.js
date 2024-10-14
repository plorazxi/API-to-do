const jwt = require("jsonwebtoken");
const { randomInt } = require("node:crypto");

/**
 * Função feita para gerar IDs de forma aleatoria
 * @param {Array} DataBase - Lista de objetos
 * @returns int
*/

function gerarID(DataBase) {
    let id = randomInt(9999);
    const verify = DataBase.find((obj) => {
        return obj.id === id;
    });
    if(verify) return gerarID(DataBase);
    else return id;
}

/**
 * Função para verificar token
 * @param {String} token 
 * @param {Response} res - Response da rota
 * @returns Object
*/

function ver_token(token, res) {
    return jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if(err) {
            res.status(401).send({msg: "Token inválido"});
            return null;
        } else return decoded;
    });
}

/**
 * Funçãopara encontrar a task através do ID
 * @param {Object[]} DataBase - Lista de objetos
 * @param {Number} req_id - ID vinda da requisição
 * @param {Request} res - Request da rota
 * @returns Object || NULL
*/

function proc_task(DataBase, req_id, res) {
    const result = DataBase.filter((task) => { // Cria lista com tasks com o req_id
        if(task.id == req_id) return task;
    });
    if(result.length>1) { // Se tiver mais que um na lista
        res.status(506).send({erro: "banco de dados com falhas"});
        return null;
    } else if(result.length==0) { // Se a lista tiver vazia
        res.status(400).send({erro: "id de task invalida"});
        return null;
    }
    return result[0];
}

/**
 * Função para procurar o usuário através do email
 * @param {Object[]} DataBase - Lista de objetos
 * @param {String} req_email - Email vindo da requisição
 * @param {Response} res - Response da rota
 * @returns Object || NULL
*/

function proc_user_byEmail(DataBase, req_email, res) {
    const result = DataBase.filter((user) => { // Cria lista com usuários com o req_email
        if(user.email==req_email) return user;
    });
    if(result.length>1) { // Se tiver mais de um user na lista
        res.status(506).send({erro: "banco de dados com falhas"});
        return null;
    } else if(result.length==0) { // Se não tiver user na lista
        res.status(401).send({erro: "email inválido"});
        return null;
    }
    return result[0];
}

/**
 * Função para encontrar usuário através do nome e data de nascimento
 * @param {Object[]} DataBase - Lista da objetos
 * @param {String} req_name - Nome vindo do Request
 * @param {String} req_nasc - Data de nascimento vindo do Request
 * @param {Response} res - Response da rota
 * @returns Object || NULL
*/

function proc_user_byName(DataBase, req_name, req_nasc, res) {
    const result = DataBase.filter((user) => { // Cria lista com users com o nome req_name e data de nascimento req_nasc (ao mesmo tempo)
        if(user.nome == req_name && user.data_nascimento == req_nasc) return user;
    });
    if(result.length>1) { // Se encontrar mais de 1 user
        res.status(506).send({erro: "banco de dados com falhas"});
        return null;
    } else if(result.length==0) { // Se não encontrar nenhum user
        res.status(401).send({erro: "nome ou data de nacimento invalido"});
        return null;
    }
    return result[0];
}

/**
 * Função para verificar se um email ja está sendo utilizado
 * @param {Object[]} DataBase - Lista de objetos
 * @param {String} email - Email para procurar
 * @returns Boolean - true = sendo utilizado | false = não está sendo utilizado
*/

function ver_email(DataBase, email) {
    const result = DataBase.filter((user) => {// Cria lista com usuários de mesmo email
        if(user.email == email) return user;
    });
    if(result.length != 0) return true; // Caso tenha alguém utilizando este email
    else return false;
}

module.exports = { gerarID, ver_token, proc_task, proc_user_byEmail, proc_user_byName, ver_email };