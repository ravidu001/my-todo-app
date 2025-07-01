import React, { useEffect, useState } from 'react';

import { useTodos } from '../contexts/TodoContext';

const TodoFilters = () => {
  const { filters, updateFilters, stats } = useTodos();
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, updateFilters]);

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const getStatusCount = (status) => {
    switch (status) {
      case 'active': return stats.active;
      case 'completed': return stats.completed;
      case 'overdue': return stats.overdue;
      default: return stats.total;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border border-secondary-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search todos by title or description..."
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-secondary-400 hover:text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', icon: '📋', count: stats.total },
              { value: 'active', label: 'Active', icon: '○', count: stats.active },
              { value: 'completed', label: 'Completed', icon: '✓', count: stats.completed },
              { value: 'overdue', label: 'Overdue', icon: '⚠️', count: stats.overdue }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => handleFilterChange('status', status.value)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.status === status.value
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                    : 'bg-secondary-100 text-secondary-700 border-2 border-transparent hover:bg-secondary-200'
                }`}
              >
                <span className="mr-1">{status.icon}</span>
                {status.label}
                <span className="ml-2 bg-white rounded-full px-2 py-1 text-xs font-semibold">
                  {status.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Filter by Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Priorities', icon: '🎯' },
              { value: 'high', label: 'High', icon: '🔴' },
              { value: 'medium', label: 'Medium', icon: '🟡' },
              { value: 'low', label: 'Low', icon: '🟢' }
            ].map((priority) => (
              <button
                key={priority.value}
                onClick={() => handleFilterChange('priority', priority.value)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.priority === priority.value
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                    : 'bg-secondary-100 text-secondary-700 border-2 border-transparent hover:bg-secondary-200'
                }`}
              >
                <span className="mr-1">{priority.icon}</span>
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Sort by
          </label>
          <div className="space-y-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('sortOrder', 'desc')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filters.sortOrder === 'desc'
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-secondary-100 text-secondary-700 border border-secondary-300 hover:bg-secondary-200'
                }`}
              >
                ↓ Descending
              </button>
              <button
                onClick={() => handleFilterChange('sortOrder', 'asc')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filters.sortOrder === 'asc'
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-secondary-100 text-secondary-700 border border-secondary-300 hover:bg-secondary-200'
                }`}
              >
                ↑ Ascending
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.status !== 'all' || filters.priority !== 'all' || filters.search) && (
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-secondary-700">Active filters:</span>
              {filters.status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-info-100 text-info-800">
                  Status: {filters.status}
                </span>
              )}
              {filters.priority !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Priority: {filters.priority}
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                  Search: "{filters.search}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                updateFilters({ status: 'all', priority: 'all', search: '' });
                setSearchInput('');
              }}
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoFilters;
