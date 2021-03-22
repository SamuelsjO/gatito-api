const express = require('express')
const app = express()
const bodyParser  = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEcontrados')
const roteador = require('./routes/fornecedores')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorError = require('./Serializador').SerializadorError

app.use(bodyParser.json())

app.use((req, res, proximo) => {
    let formatosRequisitado = req.header('Accept')

    if(formatosRequisitado === '*/*') {
        formatosRequisitado = 'application/json'
    }

    if(formatosAceitos.indexOf(formatosRequisitado) === -1) {
        res.status(406)
        res.end()
        return
    }

    res.setHeader('Content-Type', formatosRequisitado)
    proximo()
})

app.use((req, res, proximo) => {
    res.set('Access-Control-Allow-Origin', '*')
    proximo()
})

app.use((erro, req, res, proximo) => {
    let status = 500
    
    if(erro instanceof NaoEncontrado) {
        status = 404
    }
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }
    if(erro instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorError(
        res.getHeader('Content-Type')
    )
    res.status(status)
    res.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.use('/api/fornecedores', roteador)

const roteadorV2 = require('./routes/fornecedores/routes.v2')
app.use('/api/v2/fornecedores', roteadorV2)

app.listen(config.get('api.porta'), () => console.log('Api is running'))