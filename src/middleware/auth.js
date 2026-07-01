const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Usuario.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario nao encontrado' });
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Nao autorizado, token invalido' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Nao autorizado, token ausente' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Usuario.findById(decoded.id);
    } catch (error) {
      // Optional auth, so don't error here
    }
  }
  
  next();
};

const requireUserMatch = (req, res, next) => {
  const explicitUserId = req.headers['x-user-id'] || req.body.usuarioId || req.body.usuario_id || req.query.usuarioId || req.query.usuario_id;

  if (!explicitUserId) {
    return res.status(403).json({ error: 'Informe o ID do usuario na requisicao' });
  }

  if (String(explicitUserId) !== String(req.user.id)) {
    return res.status(403).json({ error: 'ID do usuario nao confere com o token' });
  }

  next();
};

module.exports = { protect, optionalAuth, requireUserMatch };
