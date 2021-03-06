const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fonercedor')
const roteadorProdutos = require('./produtos')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Acess-Control-Allow-Methods' , 'GET, POST')
    res.set('Acess-Control-Allow-Headers' , 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const serializarador = new SerializadorFornecedor(
        res.getHeader('Content-Type'),
        ['empresa']
    )
    res.send(
        serializarador.serializar(resultados)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        res.status(201)
        const serializarador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['empresa']
        )
        res.send(
            serializarador.serializar(fornecedor)
        )   
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Acess-Control-Allow-Methods' , 'GET, PUT, DELETE')
    res.set('Acess-Control-Allow-Headers' , 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        res.status(200)
        const serializarador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'empresa', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.send(
            serializarador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:idFornecedor', async (req, res, proximo) => {
    
    try {
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204)
        res.end()

    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204)
        res.end()
    } catch (erro) {
        proximo(erro)
    }
})

const verificarFornecedor = async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        proximo()
    } catch (erro) {
        proximo(erro)
    }
}

roteador.use('/:idFornecedor/produtos',verificarFornecedor, roteadorProdutos)

module.exports = roteador