'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { JobDetailModal } from '@/components/modals/JobDetailModal';
import { Job } from '@/types';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Application Board</h1>
          <p className="text-gray-600 mt-1">Track your job applications and manage your career journey</p>
        </div>
        
        <KanbanBoard onJobClick={handleJobClick} />
      </main>
      
      <ChatWidget isOpen={isChatOpen} onToggle={toggleChat} />
      
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
