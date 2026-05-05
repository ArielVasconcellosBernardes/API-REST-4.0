const express = require('express');
const { body } = require('express-validator');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getUserPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { sanitizeInput, rateLimiter } = require('../middleware/sanitize');

const router = express.Router();

const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be 1-2000 characters'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be 1-500 characters')
];

router.post('/', protect, sanitizeInput, rateLimiter(20, 60000), postValidation, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, sanitizeInput, postValidation, updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, sanitizeInput, commentValidation, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

router.get('/user', protect, getUserPosts);           
router.get('/user/:userId', protect, getUserPosts);   

module.exports = router;