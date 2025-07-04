const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // Allow null/undefined (optional field)
        if (!value) return true;
        
        // Only validate future dates on new documents, not on updates
        if (this.isNew) {
          return value > new Date();
        }
        
        // For existing documents, allow any date (don't re-validate)
        return true;
      },
      message: 'Due date must be in the future'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'overdue'],
      message: 'Status must be either active, completed, or overdue'
    },
    default: 'active'
  },
  completedAt: {
    type: Date,
    default: null
  },
  completedAfterOverdue: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Todo must belong to a user'],
    index: true // Index for faster queries
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: function() {
      return this.isRecurring;
    }
  }
}, {
  timestamps: true, // createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if todo is overdue
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') {
    return false;
  }
  return new Date() > this.dueDate;
});

// Virtual for days until due
todoSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate || this.status === 'completed') {
    return null;
  }
  const today = new Date();
  const diffTime = this.dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Index for efficient queries
todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ user: 1, dueDate: 1 });
todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to update status based on due date
todoSchema.pre('save', function(next) {
  // Auto-mark as overdue if past due date and not completed
  if (this.dueDate && this.status === 'active' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  
  // Set completedAt timestamp when marking as completed
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    // Check if completing after overdue
    if (!this.completedAfterOverdue && this.dueDate && new Date() > this.dueDate) {
      this.completedAfterOverdue = true;
    }
  }
  
  // Clear completedAt when marking as active/overdue
  if (this.status !== 'completed' && this.completedAt) {
    this.completedAt = null;
    this.completedAfterOverdue = false;
  }
  
  next();
});

// Static method to get user's todo statistics
todoSchema.statics.getUserStats = async function(userId) {
  const now = new Date();
  
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        active: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$status', 'completed'] },
                  {
                    $or: [
                      { $eq: ['$dueDate', null] },
                      { $gte: ['$dueDate', now] }
                    ]
                  }
                ]
              },
              1,
              0
            ]
          }
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$status', 'completed'] },
                  { $ne: ['$dueDate', null] },
                  { $lt: ['$dueDate', now] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  // Return formatted stats
  return stats.length > 0 ? stats[0] : {
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0
  };
};

// Static method to get todos by priority
todoSchema.statics.getByPriority = function(userId, priority) {
  return this.find({ user: userId, priority }).sort({ createdAt: -1 });
};

// Static method to get overdue todos
todoSchema.statics.getOverdue = function(userId) {
  return this.find({
    user: userId,
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

// Instance method to mark as completed
todoSchema.methods.markCompleted = function() {
  const wasOverdue = this.status === 'overdue' || (this.dueDate && new Date() > this.dueDate);
  this.status = 'completed';
  this.completedAt = new Date();
  this.completedAfterOverdue = wasOverdue;
  return this.save();
};

// Instance method to mark as active
todoSchema.methods.markActive = function() {
  this.status = 'active';
  this.completedAt = null;
  this.completedAfterOverdue = false;
  // Check if it should be overdue
  if (this.dueDate && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  return this.save();
};

module.exports = mongoose.model('Todo', todoSchema);
