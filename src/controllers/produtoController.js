const Produto = require('../models/produtoModel');

const list = async (req, res) => {
  const produtos = await Produto.findAll();
  res.json({ success: true, data: produtos });
};

const getById = async (req, res) => {
  const produto = await Produto.findById(req.params.id);
  if (!produto) return res.status(404).json({ error: 'Produto nao encontrado' });
  res.json({ success: true, data: produto });
};

const create = async (req, res) => {
  const { nome, preco, categoria_id } = req.body;
  if (!nome || preco === undefined || !categoria_id) {
    return res.status(400).json({ error: 'Nome, preco e categoria_id sao obrigatorios' });
  }

  const produto = await Produto.create(req.body);
  res.status(201).json({ success: true, data: produto });
};

const update = async (req, res) => {
  const produto = await Produto.update(req.params.id, req.body);
  if (!produto) return res.status(404).json({ error: 'Produto nao encontrado' });
  res.json({ success: true, data: produto });
};

const remove = async (req, res) => {
  const deleted = await Produto.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Produto nao encontrado' });
  res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
