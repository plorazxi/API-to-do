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
    console.log(verify);
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
    const kk = DataBase.filter((value) => {
        return value;
    })
    const result = DataBase.filter((task) => {
        if(task.id == req_id) return task;
    });
    if(result.length>1) { 
        res.status(506).send({erro: "banco de dados com falhas"});
        return null;
    } else if(result.length==0) { 
        res.status(400).send({erro: "id de task invalida"});
        return null;
    }
    return result[0];
}

module.exports = { gerarID, ver_token, proc_task };