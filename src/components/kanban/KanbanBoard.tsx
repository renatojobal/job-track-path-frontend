'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Column } from './Column';
import { FilterBar } from './FilterBar';
import { Job, Column as ColumnType } from '@/types';
import { useJobs } from '@/lib/hooks/useJobs';

interface KanbanBoardProps {
  onJobClick: (job: Job) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onJobClick }) => {
  const { jobs, loading, error, updateJobStatus } = useJobs();
  const [columns, setColumns] = useState<Record<string, ColumnType>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // Organize jobs into columns based on status
  useEffect(() => {
    const organizedColumns: Record<string, ColumnType> = {
      'got-interview': {
        id: 'got-interview',
        title: 'Got Interview',
        jobs: jobs.filter((job) => job.status === 'got-interview'),
      },
      'in-process': {
        id: 'in-process',
        title: 'In Process',
        jobs: jobs.filter((job) => job.status === 'in-process'),
      },
      accepted: {
        id: 'accepted',
        title: 'Accepted',
        jobs: jobs.filter((job) => job.status === 'accepted'),
      },
      rejected: {
        id: 'rejected',
        title: 'Rejected',
        jobs: jobs.filter((job) => job.status === 'rejected'),
      },
    };
    setColumns(organizedColumns);
  }, [jobs]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeJobId = active.id as string;
    const overColumnId = over.id as string;

    // Find which column contains the dragged job
    let sourceColumnId: string | undefined;
    let job: Job | undefined;

    Object.keys(columns).forEach((columnId) => {
      const foundJob = columns[columnId].jobs.find((job) => job.id === activeJobId);
      if (foundJob) {
        sourceColumnId = columnId;
        job = foundJob;
      }
    });

    if (!sourceColumnId || !job || sourceColumnId === overColumnId) return;

    try {
      // Update job status in Supabase
      await updateJobStatus(activeJobId, overColumnId as Job['status']);
    } catch (err) {
      console.error('Failed to update job status:', err);
      // The useJobs hook will handle the error state
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <FilterBar />
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mt-6 overflow-x-auto pb-6">
          {['Got Interview', 'In Process', 'Accepted', 'Rejected'].map((title, index) => (
            <div key={index} className="flex-1 min-w-[300px] bg-white rounded-md shadow-sm border-t-4 border-t-gray-300">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                <div className="mt-1 text-sm text-gray-500">Loading...</div>
              </div>
              <div className="p-2">
                <div className="animate-pulse space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <FilterBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading jobs</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <p className="text-sm text-gray-400">Make sure your Supabase configuration is set up correctly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mt-6 overflow-x-auto pb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.values(columns).map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              jobs={column.jobs}
              onJobClick={onJobClick}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};