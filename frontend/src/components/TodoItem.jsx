import React, { useState } from 'react';

import { useTodos } from '../contexts/TodoContext';

const TodoItem = ({ todo, onEdit }) => {
  const { toggleTodo, deleteTodo } = useTodos();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const handleToggle = async () => {
    setActionLoading('toggle');
    await toggleTodo(todo._id);
    setActionLoading(null);
  };

  const handleDelete = async () => {
    setActionLoading('delete');
    const result = await deleteTodo(todo._id);
    if (result.success) {
      setShowDeleteConfirm(false);
    }
    setActionLoading(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error-500 bg-error-50';
      case 'medium': return 'border-l-warning-500 bg-warning-50';
      case 'low': return 'border-l-success-500 bg-success-50';
      default: return 'border-l-secondary-500 bg-secondary-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error-100 text-error-800 border-error-200';
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low': return 'bg-success-100 text-success-800 border-success-200';
      default: return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-800 border-success-200';
      case 'overdue': return 'bg-error-100 text-error-800 border-error-200';
      case 'active': return 'bg-info-100 text-info-800 border-info-200';
      default: return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed';

  return (
    <>
      <div className={`bg-white border-l-4 rounded-r-lg shadow-soft hover:shadow-soft-lg transition-shadow ${getPriorityColor(todo.priority)} ${
        todo.status === 'completed' ? 'opacity-75' : ''
      }`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start space-x-3 flex-1">
              {/* Checkbox */}
              <button
                onClick={handleToggle}
                disabled={actionLoading === 'toggle'}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  todo.status === 'completed'
                    ? 'bg-success-500 border-success-500 text-white'
                    : 'border-secondary-300 hover:border-success-500'
                } ${actionLoading === 'toggle' ? 'opacity-50' : ''}`}
              >
                {actionLoading === 'toggle' ? (
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : todo.status === 'completed' ? (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </button>

              {/* Todo Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  todo.status === 'completed' ? 'line-through text-secondary-500' : 'text-secondary-900'
                }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-sm ${
                    todo.status === 'completed' ? 'line-through text-secondary-400' : 'text-secondary-600'
                  }`}>
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(todo)}
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                title="Edit todo"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-secondary-400 hover:text-error-600 transition-colors"
                title="Delete todo"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Priority Badge */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(todo.priority)}`}>
                {todo.priority === 'high' && '🔴'}
                {todo.priority === 'medium' && '🟡'}
                {todo.priority === 'low' && '🟢'}
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>

              {/* Status Badge */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(todo.status)}`}>
                {todo.status === 'completed' && '✓'}
                {todo.status === 'overdue' && '⚠️'}
                {todo.status === 'active' && '○'}
                {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
              </span>

              {/* Completed After Overdue Indicator */}
              {todo.status === 'completed' && todo.completedAfterOverdue && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 border border-warning-200">
                  ⚠️ Completed Late
                </span>
              )}

              {/* Tags */}
              {todo.tags && todo.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  {todo.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200"
                    >
                      #{tag}
                    </span>
                  ))}
                  {todo.tags.length > 2 && (
                    <span className="text-xs text-secondary-500">
                      +{todo.tags.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Due Date */}
            {todo.dueDate && (
              <div className={`text-xs ${
                isOverdue ? 'text-error-600 font-medium' : 'text-secondary-500'
              }`}>
                {isOverdue && '⚠️ '}
                Due: {formatDate(todo.dueDate)}
              </div>
            )}
          </div>

          {/* Completed timestamp */}
          {todo.completedAt && (
            <div className={`mt-2 text-xs ${todo.completedAfterOverdue ? 'text-warning-600 font-medium' : 'text-secondary-500'}`}>
              {todo.completedAfterOverdue ? '⚠️ ' : ''}
              Completed on {new Date(todo.completedAt).toLocaleString()}
              {todo.completedAfterOverdue && ' (after due date)'}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-soft-lg max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100">
                  <svg className="h-6 w-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Delete Todo
                </h3>
                <p className="text-sm text-secondary-500 mb-4">
                  Are you sure you want to delete "{todo.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 border border-secondary-300 rounded-md hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading === 'delete'}
                  className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 transition-colors ${
                    actionLoading === 'delete'
                      ? 'bg-error-400 cursor-not-allowed'
                      : 'bg-error-600 hover:bg-error-700'
                  }`}
                >
                  {actionLoading === 'delete' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoItem;
