const express = require('express');
const controller = require('../controllers/pedidoController');
const { protect, requireUserMatch } = require('../middleware/auth');

const router = express.Router();
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.use(protect, requireUserMatch);

router.get('/', asyncRoute(controller.list));
router.get('/:id', asyncRoute(controller.getById));
router.post('/', asyncRoute(controller.create));
router.put('/:id', asyncRoute(controller.update));
router.delete('/:id', asyncRoute(controller.remove));

module.exports = router;
