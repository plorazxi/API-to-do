const { randomInt } = require("node:crypto");

/**
 * Função feita para gerar IDs de forma aleatoria
 * @param {Array} DataBase - Lista de objetos
 * @returns int
*/

function gerarID(DataBase) {
    let id = randomInt(15);
    const verify = DataBase.find((obj) => {
        return obj.id === id;
    });
    console.log(verify);
    if(verify) return gerarID(DataBase);
    else return id;
}

module.exports = { gerarID };