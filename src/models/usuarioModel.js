const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const publicFields = 'id, nome, email, criado_em';

const normalize = (user) => user && ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  criadoEm: user.criado_em
});

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, nome, email, senha, criado_em FROM usuarios WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT ${publicFields} FROM usuarios WHERE id = ? LIMIT 1`,
    [id]
  );
  return normalize(rows[0]);
};

const create = async ({ nome, email, password }) => {
  const senha = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 10));
  const [result] = await pool.execute(
    `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
    [nome, email, senha]
  );
  return findById(result.insertId);
};

const update = async (id, { nome, email, password }) => {
  const fields = [];
  const values = [];

  if (nome !== undefined) {
    fields.push('nome = ?');
    values.push(nome);
  }
  if (email !== undefined) {
    fields.push('email = ?');
    values.push(email);
  }
  if (password !== undefined) {
    fields.push('senha = ?');
    values.push(await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 10)));
  }

  if (!fields.length) return findById(id);

  values.push(id);
  await pool.execute(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

module.exports = { create, findByEmail, findById, update };
