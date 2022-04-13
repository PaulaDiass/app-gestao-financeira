const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const { autenticarUsuario } = require('./autenticacao');
const { send } = require('express/lib/response');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório!');
    }
    if (!email) {
        return res.status(404).json('O campo email é obrigatório!');
    }
    if (!senha) {
        return res.status(404).json('O campo senha é obrigatório!');
    }

    try {
        const queryConsultaEmailExistente = 'select * from usuarios where email=$1';
        const { rowCount } = await conexao.query(queryConsultaEmailExistente, [email]);
        if (rowCount > 0) {
            return res.status(400).json('Já existe usuário cadastrado com o e-mail informado.');
        }

        const novaSenha = await bcrypt.hash(senha, 10);

        const queryInserirUsuario = 'insert into usuarios(nome, email, senha) values($1,$2,$3) RETURNING id';
        const usuarioCadastrado = await conexao.query(queryInserirUsuario, [nome, email, novaSenha]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        }
        const idUsuarioCadastrado = usuarioCadastrado.rows[0].id;
        const queryUsuarioCadastrado = 'select id, nome, email from usuarios where id=$1';
        const retornoUsuarioCadastrado = await conexao.query(queryUsuarioCadastrado, [idUsuarioCadastrado]);

        if (retornoUsuarioCadastrado.rowCount === 0) {
            return res.status(400).json('Usuário não encontrado.');
        }

        return res.status(201).json(retornoUsuarioCadastrado.rows[0]);
    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao cadastrar usuário. Detalhes: ${error.message}` });
    }

};

const obterUsuario = async (req, res) => {
    const id = autenticarUsuario(req);

    if (!id) {
        return;
    }
    try {
        const queryObterUsuario = 'select * from usuarios where id=$1';
        const { rowCount, rows } = await conexao.query(queryObterUsuario, [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não identificado.' });
        }

        const usuario = rows[0];

        const { senha, ...propriedades } = usuario;

        return res.status(200).json({ ...propriedades });

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter detalhes do usuário. Detalhes: ${error.message}` });
    }
};

const atualizarUsuario = async (req, res) => {
    const id = autenticarUsuario(req, res);
    const { nome, email, senha } = req.body;
    if (!id) {
        return;
    }

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório!');
    }
    if (!email) {
        return res.status(404).json('O campo email é obrigatório!');
    }
    if (!senha) {
        return res.status(404).json('O campo senha é obrigatório!');
    }
    try {
        const queryConsultaEmailExistente = 'select * from usuarios where email=$1';
        const usuarioExistente = await conexao.query(queryConsultaEmailExistente, [email]);
        if (usuarioExistente.rowCount > 0) {
            return res.status(400).json('Já existe usuário cadastrado com o e-mail informado.');
        }

        const queryObterUsuario = 'select * from usuarios where id=$1';
        const { rowCount } = await conexao.query(queryObterUsuario, [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não identificado.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizarUsuario = 'update usuarios set nome=$1, email=$2, senha=$3 where id=$4';

        const usuarioEditado = await conexao.query(queryAtualizarUsuario, [nome, email, senhaCriptografada, id]);

        if (usuarioEditado.rowCount === 0) {
            return res.status(500).json({ mensagem: "Ocorreu um erro ao persistir o usuário." });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter detalhes do usuário. Detalhes: ${error.message}` });
    }
}

module.exports = { cadastrarUsuario, obterUsuario, atualizarUsuario };