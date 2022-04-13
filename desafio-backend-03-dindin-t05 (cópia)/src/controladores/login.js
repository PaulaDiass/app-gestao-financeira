const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { chave } = require('../chaveUnica');



const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json('Email e senha são obrigatórios.');
    }

    try {
        const queryVerificarUsuario = 'select * from usuarios where email=$1';
        const { rowCount, rows } = await conexao.query(queryVerificarUsuario, [email]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        const usuarioEncontrado = rows[0];
        const senhaAutentica = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaAutentica) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
        }

        const token = jwt.sign({ id: usuarioEncontrado.id }, chave, { expiresIn: '1d' });

        const { senha: senhaUsuario, ...propriedades } = usuarioEncontrado;

        return res.status(200).json({
            usuario: { ...propriedades },
            token
        });

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar efetuar login. Detalhes: ${error.message}` });
    }
}


module.exports = { login };