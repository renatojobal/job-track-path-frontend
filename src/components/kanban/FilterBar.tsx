'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
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
          
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option>Sort by: Newest</option>
            <option>Sort by: Salary (high to low)</option>
            <option>Sort by: Salary (low to high)</option>
            <option>Sort by: Company name</option>
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="40000"
                max="250000"
                step="10000"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$40k</span>
              <span>$250k</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tech Stack
            </label>
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>All technologies</option>
              <option>React</option>
              <option>TypeScript</option>
              <option>Node.js</option>
              <option>Python</option>
              <option>Java</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Mode
            </label>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Remote
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                Hybrid
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                On-site
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};