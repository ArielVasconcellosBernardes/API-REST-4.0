const Cliente = require('../models/clienteModel');

const list = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json({ success: true, data: clientes });
};

const getById = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente nao encontrado' });
  res.json({ success: true, data: cliente });
};

const create = async (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) return res.status(400).json({ error: 'Nome e email sao obrigatorios' });

  const cliente = await Cliente.create(req.body);
  res.status(201).json({ success: true, data: cliente });
};

const update = async (req, res) => {
  const cliente = await Cliente.update(req.params.id, req.body);
  if (!cliente) return res.status(404).json({ error: 'Cliente nao encontrado' });
  res.json({ success: true, data: cliente });
};

const remove = async (req, res) => {
  const deleted = await Cliente.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Cliente nao encontrado' });
  res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
