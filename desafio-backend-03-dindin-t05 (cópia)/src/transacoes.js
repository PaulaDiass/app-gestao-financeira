const conexao = require('./conexao');
const { autenticarUsuario } = require('./controladores/autenticacao');

const listarTrasacoesDoUsuario = async (req, res) => {
    const { filtro } = req.query;
    const id = autenticarUsuario(req, res);
    if (!id) {
        return;
    }


    try {
        const queryObterUsuario = 'select * from usuarios where id=$1';
        const { rowCount } = await conexao.query(queryObterUsuario, [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não identificado.' });
        }

        let querytransacoes = 'select a.id, a.tipo, a.descricao, a.valor, a.data, a.usuario_id, a.categoria_id, b.descricao as categoria_nome from transacoes a left join categorias b on a.categoria_id=b.id where usuario_id=$1';

        if (filtro) {
            querytransacoes += " and ";

            for (let i = 0; i < filtro.length; i++) {

                querytransacoes += " b.descricao='" + filtro[i] + "'";

                if (i !== filtro.length - 1) {
                    querytransacoes += " or ";
                }
            }
        }
        querytransacoes += " order by a.data desc";
        const retornoTransacoes = await conexao.query(querytransacoes, [id]);

        return res.status(200).json(retornoTransacoes.rows);

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter as trasações do usuário. Detalhes: ${error.message}` });
    }
}

const obterUmaTransacaoDoUsuario = async (req, res) => {
    const { id } = req.params;
    const idUsuario = autenticarUsuario(req, res);
    if (!idUsuario) {
        return;
    }
    try {
        const queryObterUsuario = 'select * from usuarios where id=$1';
        const { rowCount } = await conexao.query(queryObterUsuario, [idUsuario]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não identificado.' });
        }

        const queryConsultarTransacao = 'select a.id, a.tipo, a.descricao, a.valor, a.data, a.usuario_id, a.categoria_id, b.descricao as categoria_nome from transacoes a left join categorias b on a.categoria_id=b.id where a.id=$1 and a.usuario_id=$2';
        const retornoTransacoes = await conexao.query(queryConsultarTransacao, [id, idUsuario]);

        return res.status(200).json(retornoTransacoes.rows[0]);

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter a trasação do usuário. Detalhes: ${error.message}` });
    }
}

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const idUsuario = autenticarUsuario(req, res);
    if (!idUsuario) {
        return;
    }

    if (!descricao) {
        return res.status(400).json({ mensagem: "O campo descricao é obrigatório" });
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "O campo valor é obrigatório" });
    }
    if (!data) {
        return res.status(400).json({ mensagem: "O campo data é obrigatório" });
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: "O campo categoria_id é obrigatório" });
    }
    if (!tipo) {
        return res.status(400).json({ mensagem: "O campo tipo é obrigatório" });
    }

    try {
        const queryExisteCategoria = 'select * from categorias where id=$1';
        const { rowCount } = await conexao.query(queryExisteCategoria, [categoria_id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "A categoria especificada não existe" });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "O tipo não corresponde a entrada ou saída." });
        }

        const queryCadastrarTransacao = 'insert into transacoes(descricao, valor, data, categoria_id, tipo, usuario_id) values($1,$2,$3,$4,$5,$6) RETURNING id'
        const transacaoRetorno = await conexao.query(queryCadastrarTransacao, [descricao, valor, data, categoria_id, tipo, idUsuario]);

        if (transacaoRetorno.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar transação.' });
        }
        const idTransacaoCadastrada = transacaoRetorno.rows[0].id;

        const querySelecionarTransacao = 'select a.id, a.tipo, a.descricao, a.valor, a.data, a.usuario_id, a.categoria_id, b.descricao as categoria_nome from transacoes a left join categorias b on a.categoria_id=b.id where a.id=$1';
        const retorno = await conexao.query(querySelecionarTransacao, [idTransacaoCadastrada]);

        if (retorno.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada!" });
        }

        return res.status(201).json(retorno.rows[0]);

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar cadastrar trasação do usuário. Detalhes: ${error.message}` });
    }

}

const editarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const idUsuario = autenticarUsuario(req, res);
    if (!idUsuario) {
        return;
    }

    if (!descricao) {
        return res.status(400).json({ mensagem: "O campo descricao é obrigatório" });
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "O campo valor é obrigatório" });
    }
    if (!data) {
        return res.status(400).json({ mensagem: "O campo data é obrigatório" });
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: "O campo categoria_id é obrigatório" });
    }
    if (!tipo) {
        return res.status(400).json({ mensagem: "O campo tipo é obrigatório" });
    }

    try {
        const queryVerificaSeTransacaoPertenceAoUsuario = 'select * from transacoes where id=$1';
        const retornoVerificaTransacao = await conexao.query(queryVerificaSeTransacaoPertenceAoUsuario, [id]);

        if (retornoVerificaTransacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação inexistente!" });
        }
        if (retornoVerificaTransacao.rows[0].usuario_id !== idUsuario) {
            return res.status(403).json({ mensagem: "Esta transação não pertence a este usuário!" });
        }

        const queryExisteCategoria = 'select * from categorias where id=$1';
        const { rowCount } = await conexao.query(queryExisteCategoria, [categoria_id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "A categoria especificada não existe" });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "O tipo não corresponde a entrada ou saída." });
        }

        const queryAtualizaTransacao = 'update transacoes set descricao=$1, valor=$2, data=$3, categoria_id=$4, tipo=$5 where id=$6';
        const retornoAtualizacaoTransacao = await conexao.query(queryAtualizaTransacao, [descricao, valor, data, categoria_id, tipo, id]);

        if (retornoAtualizacaoTransacao.rowCount === 0) {
            return res.status(400).json({ mensagem: "Erro ao tentar editar transação." });
        }

        return res.status(200).send();

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar editar trasação do usuário. Detalhes: ${error.message}` });
    }
}

const deletarTransacao = async (req, res) => {
    const { id } = req.params;
    const idUsuario = autenticarUsuario(req, res);
    if (!idUsuario) {
        return;
    }
    try {
        const queryVerificaSeTransacaoPertenceAoUsuario = 'select * from transacoes where id=$1';
        const retornoVerificaTransacao = await conexao.query(queryVerificaSeTransacaoPertenceAoUsuario, [id]);

        if (retornoVerificaTransacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        if (retornoVerificaTransacao.rows[0].usuario_id !== idUsuario) {
            return res.status(403).json({ mensagem: "Esta transação não pertence a este usuário!" });
        }

        const queryDeletarTransacao = 'delete from transacoes where id=$1';
        const retorno = await conexao.query(queryDeletarTransacao, [id]);

        if (retorno.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível deletar transacao." });
        }

        return res.status(200).send();

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar deletar trasação do usuário. Detalhes: ${error.message}` });
    }
}

const obterExtratoDeTransacoes = async (req, res) => {
    const idUsuario = autenticarUsuario(req, res);
    if (!idUsuario) {
        return;
    }

    try {
        const queryEtratoEntrada = "select sum(valor) as entrada from transacoes where usuario_id=$1 and tipo='entrada'";
        const retornoExtratoEntrada = await conexao.query(queryEtratoEntrada, [idUsuario]);

        if (retornoExtratoEntrada.rowCount === 0) {
            return res.status(400).json({ mensagem: "Nenhum extrato de entrada foi encontrado." });
        }

        const queryEtratoSaida = "select sum(valor) as saida from transacoes where usuario_id=$1 and tipo='saida'";
        const retornoExtratoSaida = await conexao.query(queryEtratoSaida, [idUsuario]);

        if (retornoExtratoSaida.rowCount === 0) {
            return res.status(400).json({ mensagem: "Nenhum extrato de saída foi encontrado." });
        }

        const extratoEntrada = retornoExtratoEntrada.rows[0].entrada;
        const extratoSaida = retornoExtratoSaida.rows[0].saida;

        return res.status(200).json({
            entrada: extratoEntrada,
            saida: extratoSaida
        });


    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter extrato de trasações do usuário. Detalhes: ${error.message}` });
    }
}

module.exports = {
    listarTrasacoesDoUsuario,
    obterUmaTransacaoDoUsuario,
    cadastrarTransacao,
    editarTransacao,
    deletarTransacao,
    obterExtratoDeTransacoes
};