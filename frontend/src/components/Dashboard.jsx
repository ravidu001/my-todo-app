import React, { useState } from 'react';

import TodoFilters from './TodoFilters';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { useAuth } from '../contexts/AuthContext';
import { useTodos } from '../contexts/TodoContext';

// Helper function to get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Helper function to format today's date
const getFormattedDate = () => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date().toLocaleDateString('en-US', options);
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { todos, stats, loading, error, clearError, filters } = useTodos();
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleCloseTodoForm = () => {
    setShowTodoForm(false);
    setEditingTodo(null);
  };

  // Helper function to get dynamic empty state content based on current filter
  const getEmptyStateContent = () => {
    // Handle search results first
    if (filters.search) {
      return {
        icon: (
          <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        title: `No tasks found for "${filters.search}"`,
        description: "Try adjusting your search terms or create a new task.",
        showButton: true
      };
    }

    // Handle priority filters
    if (filters.priority !== 'all') {
      return {
        icon: (
          <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7Z" />
          </svg>
        ),
        title: `No ${filters.priority} priority tasks`,
        description: `You don't have any ${filters.priority} priority tasks right now.`,
        showButton: false
      };
    }

    // Handle status filters
    switch (filters.status) {
      case 'overdue':
        return {
          icon: (
            <svg className="mx-auto h-12 w-12 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: "No overdue tasks! 🎉",
          description: "Excellent! You're on top of your schedule. All your tasks are up to date.",
          showButton: false
        };
      case 'completed':
        return {
          icon: (
            <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: "No completed tasks yet",
          description: "Complete some tasks to see them here. You've got this!",
          showButton: false
        };
      case 'active':
        return {
          icon: (
            <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: "No active tasks",
          description: "All caught up! Create a new task to get started.",
          showButton: true
        };
      default: // 'all' or any other filter
        return {
          icon: (
            <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          title: "No tasks yet",
          description: "Get started by creating your first task.",
          showButton: true
        };
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-soft border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-left h-16 ml-5">
            <div className="flex items-center">
                <img src="/todo-icon.webp" alt="Todo Icon" className="h-8 w-8 mr-2 inline-block" />
              <h1 className="text-xl font-semibold text-secondary-900">
                My Todo App
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTodoForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-soft"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Todo
              </button>
              
              <div className="flex items-center space-x-3">
                
                
                {/* User Avatar */}
                <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                  <span className="text-sm font-medium text-primary-600">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>

                {/* User Info */}
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-secondary-900">
                    {user?.username}
                  </div>
                  <div className="text-xs text-secondary-500">
                    {user?.email}
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-soft border border-secondary-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-1">
                  {getGreeting()}, {user?.username}! 👋
                </h2>
                <p className="text-secondary-600">
                  Ready to manage your tasks and make today productive?
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                <div className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-2 rounded-md">
                  📅 {getFormattedDate()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-error-50 border border-error-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-error-600">{error}</p>
              <button
                onClick={clearError}
                className="text-error-500 hover:text-error-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-soft rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 truncate">Total Tasks</dt>
                    <dd className="text-lg font-medium text-secondary-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-soft rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-secondary-900">{stats.completed}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-soft rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 truncate">Active</dt>
                    <dd className="text-lg font-medium text-secondary-900">{stats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-soft rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 truncate">Overdue</dt>
                    <dd className="text-lg font-medium text-secondary-900">{stats.overdue}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Todo List Section */}
        <div className="space-y-6">
          {/* Filters */}
          <TodoFilters />

          {/* Todo List */}
          <div className="bg-white shadow-soft rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-secondary-900 mb-4">
                Your Tasks
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-primary-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-secondary-600">Loading your tasks...</span>
                  </div>
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-12">
                  {(() => {
                    const emptyState = getEmptyStateContent();
                    return (
                      <>
                        {emptyState.icon}
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">{emptyState.title}</h3>
                        <p className="mt-1 text-sm text-secondary-500">{emptyState.description}</p>
                        {emptyState.showButton && (
                          <div className="mt-6">
                            <button
                              onClick={() => setShowTodoForm(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Your First Task
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-4">
                  {todos.map((todo) => (
                    <TodoItem 
                      key={todo._id} 
                      todo={todo} 
                      onEdit={handleEditTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Todo Form Modal */}
        {showTodoForm && (
          <div className="fixed inset-0 bg-secondary-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-soft-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-secondary-900">
                  {editingTodo ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={handleCloseTodoForm}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TodoForm
                onClose={handleCloseTodoForm}
                editTodo={editingTodo}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
