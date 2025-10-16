'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { JobDetailModal } from '@/components/modals/JobDetailModal';
import { AddJobModal } from '@/components/forms/AddJobModal';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AuthWrapper } from './AuthWrapper';
import { useJobs } from '@/lib/hooks/useJobs';
import { Job } from '@/types';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const { addJob } = useJobs();

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleAddJob = async (jobData: Omit<Job, 'id'>) => {
    try {
      await addJob(jobData);
    } catch (error) {
      console.error('Failed to add job:', error);
      throw error;
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Job Application Board</h1>
            <p className="text-gray-600 mt-1">Track your job applications and manage your career journey</p>
          </div>
          
          <ErrorBoundary>
            <KanbanBoard onJobClick={handleJobClick} />
          </ErrorBoundary>
        </main>
        
        <ChatWidget isOpen={isChatOpen} onToggle={toggleChat} />
        
        <FloatingActionButton onClick={() => setIsAddJobModalOpen(true)} />
        
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        
        <AddJobModal 
          isOpen={isAddJobModalOpen}
          onClose={() => setIsAddJobModalOpen(false)}
          onSubmit={handleAddJob}
        />
      </div>
    </AuthWrapper>
  );
}
