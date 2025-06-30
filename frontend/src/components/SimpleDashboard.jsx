import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTodos } from '../contexts/TodoContext';

const SimpleDashboard = () => {
  const { user, logout } = useAuth();
  const { todos, stats, loading, error } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Simple Dashboard Test</h1>
        
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">User Info</h2>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Todo Stats</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Total todos: {stats.total}</p>
          <p>Active: {stats.active}</p>
          <p>Completed: {stats.completed}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Todos</h2>
          {loading ? (
            <p>Loading todos...</p>
          ) : todos.length === 0 ? (
            <p>No todos found</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li key={todo._id} className="border-b py-2">
                  <div className="flex items-center">
                    <span className={todo.status === 'completed' ? 'line-through' : ''}>
                      {todo.title}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({todo.priority})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
