const jwt = require('jsonwebtoken');
const { chave } = require('../chaveUnica');

const autenticarUsuario = (req, res) => {
    const authorization = req.headers.authorization;
    let token = 0;
    let id;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        token = authorization.split(' ')[1];
    }
    if (token === 0) {
        res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
        return 0;
    }
    try {
        id = jwt.verify(token, chave);
        return id.id;
    } catch (error) {
        res.status(400).json({ mensagem: 'Erro de verificação do token. Detalhes: ' + error.message });
        return 0;
    }
}

module.exports = { autenticarUsuario };