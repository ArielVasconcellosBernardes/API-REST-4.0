const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT id, nome, descricao, criado_em FROM categorias ORDER BY id DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, nome, descricao, criado_em FROM categorias WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ nome, descricao = null }) => {
  const [result] = await pool.execute(
    `INSERT INTO categorias (nome, descricao) VALUES (?, ?)`,
    [nome, descricao]
  );
  return findById(result.insertId);
};

const update = async (id, { nome, descricao }) => {
  const fields = [];
  const values = [];

  if (nome !== undefined) {
    fields.push('nome = ?');
    values.push(nome);
  }
  if (descricao !== undefined) {
    fields.push('descricao = ?');
    values.push(descricao);
  }

  if (!fields.length) return findById(id);

  values.push(id);
  await pool.execute(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(`DELETE FROM categorias WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = { create, findAll, findById, update, remove };
