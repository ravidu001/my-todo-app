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


router.get('/stats', getTodoStats); // Get statistics for todos
router.get('/overdue', getOverdueTodos); // Get overdue todos
router.get('/', getTodos); // Get all todos for the authenticated user
router.post('/', createTodo); // Create a new todo
router.get('/:id', getTodo); // Get a specific todo by ID
router.put('/:id', updateTodo); // Update a specific todo by ID
router.delete('/:id', deleteTodo); // Delete a specific todo by ID
router.patch('/:id/toggle', toggleTodo); // Toggle the status of a specific todo by ID

module.exports = router;
