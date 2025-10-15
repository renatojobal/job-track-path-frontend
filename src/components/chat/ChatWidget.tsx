'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: "Hi there! I'm your AI assistant. I can help you track job applications, move cards, and more.",
    },
    {
      role: 'system',
      content: 'Try asking me something like "Add Google interview, $150k, React/Node, fully remote"',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory([...chatHistory, {
      role: 'user',
      content: message,
    }]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'system',
          content: `I've added a new job application for Google with a salary of $150k using React/Node stack as a fully remote position.`,
        },
      ]);
    }, 1000);

    setMessage('');
  };

  return (
    <>
      {/* Chat bubble when closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window when open */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50 max-h-[500px]">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-medium">AI Assistant</h3>
            <button onClick={onToggle} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-3">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500">
              <p>Try: &quot;Add Microsoft interview, $130k, C#/.NET, hybrid&quot;</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};