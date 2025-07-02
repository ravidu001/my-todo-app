const Todo = require('../models/Todo');
const mongoose = require('mongoose');

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = { user: req.user.userId };
    
    // Filter by status with special handling for overdue
    if (status && ['active', 'completed', 'overdue'].includes(status)) {
      if (status === 'overdue') {
        // Overdue: not completed and past due date
        query.status = { $ne: 'completed' };
        query.dueDate = { $lt: new Date() };
      } else if (status === 'active') {
        // Active: not completed and either no due date or not past due
        query.status = { $ne: 'completed' };
        query.$or = [
          { dueDate: { $exists: false } },
          { dueDate: null },
          { dueDate: { $gte: new Date() } }
        ];
      } else {
        // Completed
        query.status = status;
      }
    }
    
    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const todos = await Todo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email');
    
    // Get total count for pagination
    const total = await Todo.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: todos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todos'
    });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('user', 'username email');

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todo'
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags, isRecurring, recurringType } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Create todo object
    const todoData = {
      title: title.trim(),
      user: req.user.userId
    };

    // Add optional fields if provided
    if (description) todoData.description = description.trim();
    if (priority) todoData.priority = priority;
    if (dueDate) todoData.dueDate = new Date(dueDate);
    if (tags && Array.isArray(tags)) todoData.tags = tags;
    if (isRecurring) {
      todoData.isRecurring = isRecurring;
      if (recurringType) todoData.recurringType = recurringType;
    }

    const todo = await Todo.create(todoData);
    
    // Populate user data before sending response
    await todo.populate('user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating todo'
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
    }

    const { title, description, priority, dueDate, status, tags, isRecurring, recurringType } = req.body;

    // Find todo
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Update fields
    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description?.trim() || '';
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;
    if (status !== undefined) todo.status = status;
    if (tags !== undefined) todo.tags = tags;
    if (isRecurring !== undefined) todo.isRecurring = isRecurring;
    if (recurringType !== undefined) todo.recurringType = recurringType;

    await todo.save();
    await todo.populate('user', 'username email');

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating todo'
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: todo
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting todo'
    });
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Toggle completion status
    if (todo.status === 'completed') {
      await todo.markActive();
    } else {
      await todo.markCompleted();
    }

    await todo.populate('user', 'username email');

    res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.status}`,
      data: todo
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling todo status',
      error: error.message
    });
  }
};

// @desc    Get user's todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res) => {
  try {
    const stats = await Todo.getUserStats(req.user.userId);
    
    // Get today's todos
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayTodos = await Todo.find({
      user: req.user.userId,
      dueDate: { $gte: today, $lt: tomorrow }
    });
    
    stats.dueToday = todayTodos.length;

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get todo stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todo statistics'
    });
  }
};

// @desc    Get overdue todos
// @route   GET /api/todos/overdue
// @access  Private
const getOverdueTodos = async (req, res) => {
  try {
    const overdueTodos = await Todo.getOverdue(req.user.userId);
    
    res.status(200).json({
      success: true,
      data: overdueTodos
    });
  } catch (error) {
    console.error('Get overdue todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue todos'
    });
  }
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getTodoStats,
  getOverdueTodos
};
