const conexao = require('../conexao');
const { autenticarUsuario } = require('./autenticacao');

const listarCategorias = async (req, res) => {
    const id = autenticarUsuario(req, res);
    if (!id) {
        return res.send();
    }

    try {
        const queryObterUsuario = 'select * from usuarios where id=$1';
        const { rowCount } = await conexao.query(queryObterUsuario, [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não identificado.' });
        }

        const queryObterCategorias = 'select * from categorias';
        const categorias = await conexao.query(queryObterCategorias);
        if (categorias.rowCount === 0) {
            return res.status(204).json(categorias.rows);
        }

        return res.status(200).json(categorias.rows);
    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar listar categorias. Detalhes: ${error.message}` });
    }
};

module.exports = { listarCategorias };