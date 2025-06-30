const express = require('express');
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getTodoStats,
  getOverdueTodos
} = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @route   GET /api/todos/stats
// @desc    Get user's todo statistics
// @access  Private
router.get('/stats', getTodoStats);

// @route   GET /api/todos/overdue
// @desc    Get overdue todos
// @access  Private
router.get('/overdue', getOverdueTodos);

// @route   GET /api/todos
// @desc    Get all todos for authenticated user
// @access  Private
router.get('/', getTodos);

// @route   POST /api/todos
// @desc    Create new todo
// @access  Private
router.post('/', createTodo);

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private
router.get('/:id', getTodo);

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put('/:id', updateTodo);

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', deleteTodo);

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', toggleTodo);

module.exports = router;
