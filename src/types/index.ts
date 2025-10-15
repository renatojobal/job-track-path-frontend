export interface Job {
  id: string;
  company: string;
  position: string;
  salary: string;
  techStack: string[];
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  applicationDate: string;
  status: 'got-interview' | 'in-process' | 'accepted' | 'rejected';
}

export interface Column {
  id: string;
  title: string;
  jobs: Job[];
}

export interface ChatMessage {
  role: 'user' | 'system';
  content: string;
}

export interface Conversation {
  id: string;
  conversationDate: string;
  responseDate?: string;
  fullName: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'responded' | 'closed' | 'follow_up';
  notes?: string;
  channel: 'whatsapp' | 'email' | 'linkedin' | 'phone' | 'other';
  linkedJobs: string[];
}