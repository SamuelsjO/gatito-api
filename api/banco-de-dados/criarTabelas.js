const modelos = [
    require('../routes/fornecedores/ModetoTabelaFornecedor'),
    require('../routes/fornecedores/Produtos/ModeloTabelaProdutos')
]

async function criarTabelas () {
    for(let count = 0; count < modelos.length; count++ ) {
        const modelo = modelos[count]
        await modelo.sync()
    }
}

criarTabelas()