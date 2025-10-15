'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, MapPin } from 'lucide-react';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: job.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 mb-3 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{job.company}</h4>
          <p className="text-sm text-gray-600 mt-1">{job.position}</p>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </div>
      </div>
      
      <div className="mt-3 text-sm font-medium text-gray-700">{job.salary}</div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {job.techStack.map((tech, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <MapPin size={14} className="mr-1" />
          {job.workMode}
        </div>
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {formatDate(job.applicationDate)}
        </div>
      </div>
    </div>
  );
};