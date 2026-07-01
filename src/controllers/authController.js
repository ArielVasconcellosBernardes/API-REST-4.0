const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, username, email, password } = req.body;
    const userName = nome || username;

    if (!userName) {
      return res.status(400).json({ error: 'Nome e obrigatorio' });
    }

    const userExists = await Usuario.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: 'Email ja cadastrado' });
    }

    const user = await Usuario.create({
      nome: userName,
      email,
      password
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await Usuario.findByEmail(email);
    
    const passwordMatches = user && (
      await bcrypt.compare(password, user.senha).catch(() => false) || password === user.senha
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Email ou senha invalidos' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        criadoEm: user.criado_em
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    const user = await Usuario.update(req.user.id, { nome, email, password });
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

module.exports = { register, login, getMe, updateProfile };
