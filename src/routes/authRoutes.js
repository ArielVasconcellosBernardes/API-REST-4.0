const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { sanitizeInput, rateLimiter } = require('../middleware/sanitize');

const router = express.Router();

const registerValidation = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Nome deve ter entre 3 e 30 caracteres'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username deve ter entre 3 e 30 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Informe um email valido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Informe um email valido'),
  body('password')
    .notEmpty()
    .withMessage('Senha e obrigatoria')
];

router.post('/register', sanitizeInput, rateLimiter(5, 60000), registerValidation, register);
router.post('/login', sanitizeInput, rateLimiter(10, 60000), loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, sanitizeInput, updateProfile);

module.exports = router;
