const { pool } = require('../config/database');

const select = `
  SELECT p.id, p.nome, p.descricao, p.preco, p.estoque, p.categoria_id, c.nome AS categoria_nome, p.criado_em
  FROM produtos p
  LEFT JOIN categorias c ON c.id = p.categoria_id
`;

const findAll = async () => {
  const [rows] = await pool.execute(`${select} ORDER BY p.id DESC`);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(`${select} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const create = async ({ nome, descricao = null, preco, estoque = 0, categoria_id }) => {
  const [result] = await pool.execute(
    `INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES (?, ?, ?, ?, ?)`,
    [nome, descricao, preco, estoque, categoria_id]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const allowed = ['nome', 'descricao', 'preco', 'estoque', 'categoria_id'];
  const fields = [];
  const values = [];

  allowed.forEach((field) => {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  });

  if (!fields.length) return findById(id);

  values.push(id);
  await pool.execute(`UPDATE produtos SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(`DELETE FROM produtos WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = { create, findAll, findById, update, remove };
