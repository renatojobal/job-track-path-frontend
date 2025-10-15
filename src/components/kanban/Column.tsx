'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { JobCard } from './JobCard';
import { Job } from '@/types';

interface ColumnProps {
  id: string;
  title: string;
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

export const Column: React.FC<ColumnProps> = ({ id, title, jobs, onJobClick }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const getColumnStyles = () => {
    switch (id) {
      case 'got-interview':
        return 'border-t-blue-500';
      case 'in-process':
        return 'border-t-yellow-500';
      case 'accepted':
        return 'border-t-green-500';
      case 'rejected':
        return 'border-t-red-500';
      default:
        return 'border-t-gray-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] bg-white rounded-md shadow-sm border-t-4 ${getColumnStyles()}`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className="mt-1 text-sm text-gray-500">
          {jobs.length} applications
        </div>
      </div>
      
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
        <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
          ))}
        </SortableContext>
        
        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No jobs in this column yet</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
              Add a job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};