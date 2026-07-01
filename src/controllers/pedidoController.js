const Pedido = require('../models/pedidoModel');

const list = async (req, res) => {
  const pedidos = await Pedido.findAll();
  res.json({ success: true, data: pedidos });
};

const getById = async (req, res) => {
  const pedido = await Pedido.findById(req.params.id);
  if (!pedido) return res.status(404).json({ error: 'Pedido nao encontrado' });
  res.json({ success: true, data: pedido });
};

const create = async (req, res) => {
  const { cliente_id, itens } = req.body;
  if (!cliente_id || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: 'cliente_id e itens sao obrigatorios' });
  }

  const pedido = await Pedido.create(req.body);
  res.status(201).json({ success: true, data: pedido });
};

const update = async (req, res) => {
  const pedido = await Pedido.update(req.params.id, req.body);
  if (!pedido) return res.status(404).json({ error: 'Pedido nao encontrado' });
  res.json({ success: true, data: pedido });
};

const remove = async (req, res) => {
  const deleted = await Pedido.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Pedido nao encontrado' });
  res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
