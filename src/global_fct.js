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
            return false;
        } else return decoded;
    });
}

module.exports = { gerarID, ver_token };