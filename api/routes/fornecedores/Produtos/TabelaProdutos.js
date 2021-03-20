const Modelo = require('./ModeloTabelaProdutos')

module.exports = {
    listar (idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            }
        })
    },

    inserir (dados) {
        return Modelo.create(dados)
    }
}