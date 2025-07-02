import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import axiosInstance from '../utils/axiosConfig';
import { useAuth } from './AuthContext';

// Create Todo Context
const TodoContext = createContext();

// Custom hook to use todo context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

// Todo Provider Component
export const TodoProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0,
    dueToday: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // all, active, completed, overdue
    priority: 'all', // all, low, medium, high
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Define functions first
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.priority !== 'all') {
        params.append('priority', filters.priority);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await axiosInstance.get(`/todos?${params.toString()}`);
      setTodos(response.data.data);
    } catch (error) {
      console.error('Fetch todos error:', error);
      setError(error.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/todos/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  }, []);

  // Load todos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
      fetchStats();
    } else {
      // Clear todos when not authenticated
      setTodos([]);
      setStats({ total: 0, active: 0, completed: 0, overdue: 0, dueToday: 0 });
    }
  }, [isAuthenticated, fetchTodos, fetchStats]);

  const createTodo = async (todoData) => {
    try {
      setError('');
      const response = await axiosInstance.post('/todos', todoData);
      const newTodo = response.data.data;
      
      // Optimistic update
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      
      // Update stats
      fetchStats();
      
      return { success: true, data: newTodo };
    } catch (error) {
      console.error('Create todo error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          'Failed to create todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateTodo = async (todoId, updateData) => {
    try {
      setError('');
      const response = await axiosInstance.put(`/todos/${todoId}`, updateData);
      const updatedTodo = response.data.data;
      
      // Update todo in state
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo._id === todoId ? updatedTodo : todo
        )
      );
      
      // Update stats
      fetchStats();
      
      return { success: true, data: updatedTodo };
    } catch (error) {
      console.error('Update todo error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          'Failed to update todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      setError('');
      await axiosInstance.delete(`/todos/${todoId}`);
      
      // Remove todo from state
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId));
      
      // Update stats
      fetchStats();
      
      return { success: true };
    } catch (error) {
      console.error('Delete todo error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const toggleTodo = async (todoId) => {
    try {
      setError('');
      const response = await axiosInstance.patch(`/todos/${todoId}/toggle`);
      const updatedTodo = response.data.data;
      
      // Update todo in state immediately for responsive UI
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo._id === todoId ? updatedTodo : todo
        )
      );
      
      // Update stats immediately
      fetchStats();
      
      // If we're filtering by status, refetch to ensure correct list
      if (filters.status !== 'all') {
        // Small delay to ensure backend has processed the change
        setTimeout(() => {
          fetchTodos();
        }, 100);
      }
      
      return { success: true, data: updatedTodo };
    } catch (error) {
      console.error('Toggle todo error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to toggle todo status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Memoize filtered todos to prevent infinite re-renders
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Filter by status
      if (filters.status !== 'all') {
        // For overdue status, check if todo is actually overdue
        if (filters.status === 'overdue') {
          const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed';
          if (!isOverdue) return false;
        } else if (todo.status !== filters.status) {
          return false;
        }
      }
      
      // Filter by priority
      if (filters.priority !== 'all' && todo.priority !== filters.priority) {
        return false;
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = todo.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = todo.description?.toLowerCase().includes(searchTerm);
        const tagMatch = todo.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
        
        if (!titleMatch && !descriptionMatch && !tagMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [todos, filters]);

  const value = {
    todos: filteredTodos,
    stats,
    loading,
    error,
    filters,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    updateFilters,
    fetchTodos,
    fetchStats,
    clearError
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
