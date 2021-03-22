const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const roteadorProdutos = require('./produtos')
const Fornecedor = require('./Fonercedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor


roteador.options('/', (req, res) => {
    res.set('Acess-Control-Allow-Methods' , 'GET')
    res.set('Acess-Control-Allow-Headers' , 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const serializarador = new SerializadorFornecedor(
        res.getHeader('Content-Type')
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
        const serializarador = new SerializadorFornecedor(
            res.getHeader('Content-Type')
        )
        res.status(201)
        res.send(
            serializarador.serializar(fornecedor)
        )   
    } catch (erro) {
        proximo(erro)
    }
})


module.exports = roteador