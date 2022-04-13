const express = require('express');
const { listarCategorias } = require('./controladores/categorias');
const { login } = require('./controladores/login');
const { cadastrarUsuario, obterUsuario, atualizarUsuario } = require('./controladores/usuarios');
const { listarTrasacoesDoUsuario, obterUmaTransacaoDoUsuario, cadastrarTransacao, editarTransacao, deletarTransacao, obterExtratoDeTransacoes } = require('./transacoes');
const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);
rotas.get('/usuario', obterUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTrasacoesDoUsuario);
rotas.get('/transacao/extrato', obterExtratoDeTransacoes);
rotas.get('/transacao/:id', obterUmaTransacaoDoUsuario);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', editarTransacao);
rotas.delete('/transacao/:id', deletarTransacao);


module.exports = rotas;