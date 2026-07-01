const { pool } = require('../config/database');

const fields = 'id, nome, email, telefone, endereco, criado_em';

const findAll = async () => {
  const [rows] = await pool.execute(`SELECT ${fields} FROM clientes ORDER BY id DESC`);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(`SELECT ${fields} FROM clientes WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const create = async ({ nome, email, telefone = null, endereco = null }) => {
  const [result] = await pool.execute(
    `INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)`,
    [nome, email, telefone, endereco]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const allowed = ['nome', 'email', 'telefone', 'endereco'];
  const updates = [];
  const values = [];

  allowed.forEach((field) => {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  });

  if (!updates.length) return findById(id);

  values.push(id);
  await pool.execute(`UPDATE clientes SET ${updates.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(`DELETE FROM clientes WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = { create, findAll, findById, update, remove };
