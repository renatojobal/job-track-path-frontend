'use client';

import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Job } from '@/types';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Omit<Job, 'id'>) => Promise<void>;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    salary: '',
    techStack: '',
    workMode: 'Remote' as 'Remote' | 'Hybrid' | 'On-site',
    status: 'got-interview' as Job['status'],
    applicationDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim()) return;

    setIsLoading(true);
    try {
      const jobData: Omit<Job, 'id'> = {
        company: formData.company,
        position: formData.position || 'Position Not Specified',
        salary: formData.salary || 'Salary Not Specified',
        techStack: formData.techStack ? formData.techStack.split(',').map(tech => tech.trim()) : [],
        workMode: formData.workMode,
        status: formData.status,
        applicationDate: formData.applicationDate,
      };

      await onSubmit(jobData);
      
      // Reset form
      setFormData({
        company: '',
        position: '',
        salary: '',
        techStack: '',
        workMode: 'Remote',
        status: 'got-interview',
        applicationDate: new Date().toISOString().split('T')[0],
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to add job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">Add New Job Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Google"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position Title
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Frontend Developer"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., $120,000 - $150,000"
                  />
                </div>
                
                <div>
                  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-1">
                    Work Mode
                  </label>
                  <select
                    id="workMode"
                    value={formData.workMode}
                    onChange={(e) => handleInputChange('workMode', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Information</h3>
              <div>
                <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack
                </label>
                <input
                  type="text"
                  id="techStack"
                  value={formData.techStack}
                  onChange={(e) => handleInputChange('techStack', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., React, TypeScript, Node.js (comma separated)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter technologies separated by commas
                </p>
              </div>
            </div>

            {/* Application Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="got-interview">Got Interview</option>
                    <option value="in-process">In Process</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Date
                  </label>
                  <input
                    type="date"
                    id="applicationDate"
                    value={formData.applicationDate}
                    onChange={(e) => handleInputChange('applicationDate', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.company.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};