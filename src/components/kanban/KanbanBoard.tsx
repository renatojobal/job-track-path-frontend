'use client';

import React, { useState } from 'react';
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

interface KanbanBoardProps {
  onJobClick: (job: Job) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onJobClick }) => {
  // Initial job data
  const initialColumns: Record<string, ColumnType> = {
    'got-interview': {
      id: 'got-interview',
      title: 'Got Interview',
      jobs: [
        {
          id: '1',
          company: 'Google',
          position: 'Frontend Developer',
          salary: '$120,000 - $150,000',
          techStack: ['React', 'TypeScript', 'Node.js'],
          workMode: 'Remote',
          applicationDate: '2023-05-15',
          status: 'got-interview',
        },
        {
          id: '2',
          company: 'Microsoft',
          position: 'Full Stack Engineer',
          salary: '$130,000 - $160,000',
          techStack: ['React', 'C#', '.NET'],
          workMode: 'Hybrid',
          applicationDate: '2023-05-10',
          status: 'got-interview',
        },
      ],
    },
    'in-process': {
      id: 'in-process',
      title: 'In Process',
      jobs: [
        {
          id: '3',
          company: 'Amazon',
          position: 'Software Development Engineer',
          salary: '$140,000 - $180,000',
          techStack: ['Java', 'AWS', 'React'],
          workMode: 'On-site',
          applicationDate: '2023-05-05',
          status: 'in-process',
        },
      ],
    },
    accepted: {
      id: 'accepted',
      title: 'Accepted',
      jobs: [
        {
          id: '4',
          company: 'Netflix',
          position: 'Senior Frontend Engineer',
          salary: '$170,000 - $200,000',
          techStack: ['React', 'JavaScript', 'Node.js'],
          workMode: 'Remote',
          applicationDate: '2023-04-20',
          status: 'accepted',
        },
      ],
    },
    rejected: {
      id: 'rejected',
      title: 'Rejected',
      jobs: [
        {
          id: '5',
          company: 'Facebook',
          position: 'UI Engineer',
          salary: '$130,000 - $160,000',
          techStack: ['React', 'TypeScript', 'GraphQL'],
          workMode: 'Hybrid',
          applicationDate: '2023-04-15',
          status: 'rejected',
        },
      ],
    },
  };

  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeJobId = active.id as string;
    const overColumnId = over.id as string;

    // Find which column contains the dragged job
    let sourceColumnId: string | undefined;
    let jobIndex: number = -1;

    Object.keys(columns).forEach((columnId) => {
      const jobIdx = columns[columnId].jobs.findIndex((job) => job.id === activeJobId);
      if (jobIdx !== -1) {
        sourceColumnId = columnId;
        jobIndex = jobIdx;
      }
    });

    if (!sourceColumnId || sourceColumnId === overColumnId || jobIndex === -1) return;

    setColumns((prev) => {
      const job = prev[sourceColumnId!].jobs[jobIndex];
      
      // Update job status to match the new column
      const updatedJob = {
        ...job,
        status: overColumnId as Job['status'],
      };

      // Remove from source column
      const newSourceJobs = [...prev[sourceColumnId!].jobs];
      newSourceJobs.splice(jobIndex, 1);

      // Add to target column
      const newTargetJobs = [...prev[overColumnId].jobs, updatedJob];

      return {
        ...prev,
        [sourceColumnId!]: {
          ...prev[sourceColumnId!],
          jobs: newSourceJobs,
        },
        [overColumnId]: {
          ...prev[overColumnId],
          jobs: newTargetJobs,
        },
      };
    });
  };

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