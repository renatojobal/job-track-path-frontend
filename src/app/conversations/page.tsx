'use client';

import React, { useState } from 'react';
import { Search, Plus, Calendar, User, Building, X, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { AuthWrapper } from '../AuthWrapper';

// Mock data for conversations (will be replaced with real data later)
const initialConversations = [
  {
    id: '1',
    company: 'Google',
    contactName: 'Sarah Johnson',
    position: 'Recruiter',
    lastMessage: 'Thanks for your time during the interview yesterday.',
    date: '2023-05-16',
    unread: true,
    messages: [
      {
        id: '1-1',
        sender: 'Sarah Johnson',
        content: 'Hi there! I saw your application for the Frontend Developer position and was impressed with your portfolio. Would you be available for an initial call this week?',
        timestamp: '2023-05-14T10:30:00',
        read: true,
      },
      {
        id: '1-2',
        sender: 'Me',
        content: "Hello Sarah, thank you for reaching out! I would be very interested in discussing the position. I'm available Wednesday or Thursday afternoon this week.",
        timestamp: '2023-05-14T11:45:00',
        read: true,
      },
      {
        id: '1-3',
        sender: 'Sarah Johnson',
        content: "Great! Let's schedule for Thursday at 2 PM. I'll send a calendar invite shortly. Looking forward to our conversation!",
        timestamp: '2023-05-14T13:20:00',
        read: true,
      },
      {
        id: '1-4',
        sender: 'Sarah Johnson',
        content: "Thanks for your time during the interview yesterday. The team was impressed with your technical skills and experience. We'd like to move forward with the next round, which will be a technical assessment. I'll send the details by tomorrow.",
        timestamp: '2023-05-16T09:15:00',
        read: false,
      },
    ],
  },
  {
    id: '2',
    company: 'Microsoft',
    contactName: 'David Chen',
    position: 'Technical Hiring Manager',
    lastMessage: "We'll need you to complete a coding challenge by Friday.",
    date: '2023-05-15',
    unread: false,
    messages: [
      {
        id: '2-1',
        sender: 'David Chen',
        content: "Hello! I'm the hiring manager for the Full Stack Engineer position. Your resume caught my attention. Do you have time for a quick call this week?",
        timestamp: '2023-05-10T14:30:00',
        read: true,
      },
      {
        id: '2-2',
        sender: 'Me',
        content: "Hi David, I'd be happy to discuss the position further. I'm available most mornings this week before noon.",
        timestamp: '2023-05-10T15:45:00',
        read: true,
      },
      {
        id: '2-3',
        sender: 'David Chen',
        content: "Perfect. Let's talk tomorrow at 10 AM. I'll send you a Teams link shortly.",
        timestamp: '2023-05-10T16:20:00',
        read: true,
      },
      {
        id: '2-4',
        sender: 'David Chen',
        content: "It was great speaking with you today. As discussed, we'll need you to complete a coding challenge by Friday. I'll email you the details shortly.",
        timestamp: '2023-05-15T11:15:00',
        read: true,
      },
    ],
  },
];

interface Conversation {
  id: string;
  company: string;
  contactName: string;
  position: string;
  lastMessage: string;
  date: string;
  unread: boolean;
  messages: Message[];
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface NewConversation {
  company: string;
  contactName: string;
  position: string;
  initialMessage: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConversation, setNewConversation] = useState<NewConversation>({
    company: '',
    contactName: '',
    position: '',
    initialMessage: '',
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark conversation as read
    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `${selectedConversation.id}-${selectedConversation.messages.length + 1}`,
      sender: 'Me',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: newMessage,
      date: new Date().toISOString().split('T')[0],
    };

    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );
    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };

  const handleCreateNewConversation = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${conversations.length + 1}`;
    const createdConversation: Conversation = {
      id: newId,
      company: newConversation.company,
      contactName: newConversation.contactName,
      position: newConversation.position,
      lastMessage: newConversation.initialMessage,
      date: new Date().toISOString().split('T')[0],
      unread: false,
      messages: [
        {
          id: `${newId}-1`,
          sender: 'Me',
          content: newConversation.initialMessage,
          timestamp: new Date().toISOString(),
          read: true,
        },
      ],
    };

    setConversations([createdConversation, ...conversations]);
    setSelectedConversation(createdConversation);
    setShowNewConversationModal(false);
    setNewConversation({
      company: '',
      contactName: '',
      position: '',
      initialMessage: '',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Conversations</h1>
        
        <div className="bg-white rounded-lg shadow-sm flex-1 flex overflow-hidden">
          {/* Conversation List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Messages</h2>
                <button
                  onClick={() => setShowNewConversationModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search conversations..."
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  } ${conversation.unread ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                        {conversation.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          {conversation.company}
                          {conversation.unread && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{conversation.contactName}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(conversation.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Detail */}
          {selectedConversation ? (
            <div className="hidden md:flex md:w-2/3 flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    {selectedConversation.company.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedConversation.company}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.contactName} • {selectedConversation.position}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Calendar size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <User size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Building size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'Me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === 'Me'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex md:w-2/3 items-center justify-center">
              <div className="text-center p-6">
                <div className="bg-gray-100 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                  <MessageCircle className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No conversation selected
                </h3>
                <p className="text-gray-500 mb-4">Select a conversation or start a new one</p>
                <button
                  onClick={() => setShowNewConversationModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Start new conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">New Conversation</h2>
              <button
                onClick={() => setShowNewConversationModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateNewConversation} className="p-4 space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={newConversation.company}
                  onChange={(e) =>
                    setNewConversation({ ...newConversation, company: e.target.value })
                  }
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  value={newConversation.contactName}
                  onChange={(e) =>
                    setNewConversation({ ...newConversation, contactName: e.target.value })
                  }
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  value={newConversation.position}
                  onChange={(e) =>
                    setNewConversation({ ...newConversation, position: e.target.value })
                  }
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="initialMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Message
                </label>
                <textarea
                  id="initialMessage"
                  value={newConversation.initialMessage}
                  onChange={(e) =>
                    setNewConversation({ ...newConversation, initialMessage: e.target.value })
                  }
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewConversationModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AuthWrapper>
  );
}