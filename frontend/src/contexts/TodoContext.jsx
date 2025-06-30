import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

  // Load todos when authenticated or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
      fetchStats();
    } else {
      // Clear todos when not authenticated
      setTodos([]);
      setStats({ total: 0, active: 0, completed: 0, overdue: 0, dueToday: 0 });
    }
  }, [isAuthenticated]); // Remove the function dependencies temporarily

  // Refetch todos when filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [filters, isAuthenticated]);

  const fetchTodos = async () => {
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
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/todos/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

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
      console.error('Toggle todo error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearError = () => {
    setError('');
  };

  // Memoize filtered todos to prevent infinite re-renders
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Additional client-side filtering can be added here
      return true;
    });
  }, [todos]);

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
