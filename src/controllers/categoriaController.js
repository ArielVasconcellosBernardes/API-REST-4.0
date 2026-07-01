const Categoria = require('../models/categoriaModel');

const list = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json({ success: true, data: categorias });
};

const getById = async (req, res) => {
  const categoria = await Categoria.findById(req.params.id);
  if (!categoria) return res.status(404).json({ error: 'Categoria nao encontrada' });
  res.json({ success: true, data: categoria });
};

const create = async (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome e obrigatorio' });

  const categoria = await Categoria.create({ nome, descricao });
  res.status(201).json({ success: true, data: categoria });
};

const update = async (req, res) => {
  const categoria = await Categoria.update(req.params.id, req.body);
  if (!categoria) return res.status(404).json({ error: 'Categoria nao encontrada' });
  res.json({ success: true, data: categoria });
};

const remove = async (req, res) => {
  const deleted = await Categoria.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Categoria nao encontrada' });
  res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
