'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export interface FilterOptions {
  searchTerm: string;
  sortBy: 'newest' | 'salary-high' | 'salary-low' | 'company';
  salaryMin: number;
  salaryMax: number;
  techStack: string;
  workMode: string;
  dateFrom: string;
}

interface FilterBarProps {
  onFiltersChange?: (filters: FilterOptions) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFiltersChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    sortBy: 'newest',
    salaryMin: 40000,
    salaryMax: 250000,
    techStack: '',
    workMode: '',
    dateFrom: '',
  });

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search jobs..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter size={16} className="mr-2" />
            Filters
            <ChevronDown
              size={16}
              className={`ml-2 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          <select 
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="salary-high">Sort by: Salary (high to low)</option>
            <option value="salary-low">Sort by: Salary (low to high)</option>
            <option value="company">Sort by: Company name</option>
          </select>
        </div>
      </div>
      
      {isFiltersOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="40000"
                max="250000"
                step="10000"
                value={filters.salaryMin}
                onChange={(e) => handleFilterChange('salaryMin', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${(filters.salaryMin / 1000).toFixed(0)}k</span>
              <span>$250k</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tech Stack
            </label>
            <select 
              value={filters.techStack}
              onChange={(e) => handleFilterChange('techStack', e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All technologies</option>
              <option value="React">React</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Mode
            </label>
            <div className="flex space-x-2">
              {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleFilterChange('workMode', filters.workMode === mode ? '' : mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    filters.workMode === mode
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};