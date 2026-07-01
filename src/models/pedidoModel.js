const { pool } = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(`
    SELECT p.id, p.cliente_id, c.nome AS cliente_nome, p.status, p.total, p.criado_em
    FROM pedidos p
    INNER JOIN clientes c ON c.id = p.cliente_id
    ORDER BY p.id DESC
  `);
  return rows;
};

const findById = async (id) => {
  const [pedidos] = await pool.execute(
    `SELECT id, cliente_id, status, total, criado_em FROM pedidos WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!pedidos[0]) return null;

  const [itens] = await pool.execute(
    `SELECT ip.id, ip.pedido_id, ip.produto_id, p.nome AS produto_nome, ip.quantidade, ip.preco_unitario
     FROM itens_pedido ip
     INNER JOIN produtos p ON p.id = ip.produto_id
     WHERE ip.pedido_id = ?`,
    [id]
  );

  return { ...pedidos[0], itens };
};

const create = async ({ cliente_id, status = 'aberto', itens = [] }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let total = 0;
    const itensCalculados = [];

    for (const item of itens) {
      const [produtos] = await connection.execute(
        `SELECT id, preco, estoque FROM produtos WHERE id = ? LIMIT 1`,
        [item.produto_id]
      );

      if (!produtos[0]) {
        throw new Error(`Produto ${item.produto_id} nao encontrado`);
      }

      const quantidade = Number(item.quantidade);
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error('Quantidade invalida');
      }

      const precoUnitario = Number(produtos[0].preco);
      total += precoUnitario * quantidade;
      itensCalculados.push({ produto_id: item.produto_id, quantidade, preco_unitario: precoUnitario });
    }

    const [pedidoResult] = await connection.execute(
      `INSERT INTO pedidos (cliente_id, status, total) VALUES (?, ?, ?)`,
      [cliente_id, status, total]
    );

    for (const item of itensCalculados) {
      await connection.execute(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`,
        [pedidoResult.insertId, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    await connection.commit();
    return findById(pedidoResult.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const update = async (id, { cliente_id, status }) => {
  const fields = [];
  const values = [];

  if (cliente_id !== undefined) {
    fields.push('cliente_id = ?');
    values.push(cliente_id);
  }
  if (status !== undefined) {
    fields.push('status = ?');
    values.push(status);
  }

  if (fields.length) {
    values.push(id);
    await pool.execute(`UPDATE pedidos SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
};

const remove = async (id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute(`DELETE FROM itens_pedido WHERE pedido_id = ?`, [id]);
    const [result] = await connection.execute(`DELETE FROM pedidos WHERE id = ?`, [id]);
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { create, findAll, findById, update, remove };
