'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Job } from '@/types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const [activeTab, setActiveTab] = useState('basic');

  if (!job) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'work', label: 'Work Details' },
    { id: 'process', label: 'Process' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{job.position}</h2>
            <p className="text-gray-600 mt-1">{job.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Company</h3>
                <p className="mt-2 text-gray-600">
                  {job.company} is a leading technology company.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Position</h3>
                <p className="mt-2 text-gray-600">{job.position}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">
                  As a {job.position} at {job.company}, you will be responsible for designing, 
                  developing, and maintaining web applications using modern frontend technologies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Tech Stack</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compensation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Salary Range</h3>
                <p className="mt-2 text-gray-600">{job.salary}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Bonus / RSU</h3>
                <p className="mt-2 text-gray-600">15% annual bonus + $50,000 RSU over 4 years</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Raises</h3>
                <p className="mt-2 text-gray-600">Annual performance-based raises, typically 3-5%</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Year-end Bonus</h3>
                <p className="mt-2 text-gray-600">Based on company and individual performance</p>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Health Insurance</h3>
                <p className="mt-2 text-gray-600">Comprehensive medical, dental, and vision coverage</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Vacation Days</h3>
                <p className="mt-2 text-gray-600">Unlimited PTO policy</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Holidays</h3>
                <p className="mt-2 text-gray-600">All federal holidays plus company-wide winter break</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Additional Benefits</h3>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>401(k) with 4% company match</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Home office stipend</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Professional development budget</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Wellness program</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Work Mode</h3>
                <p className="mt-2 text-gray-600">{job.workMode}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Laptop Provided</h3>
                <p className="mt-2 text-gray-600">Yes - MacBook Pro 16&quot;</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                <p className="mt-2 text-gray-600">Direct deposit, bi-weekly</p>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Interview Process</h3>
                <ol className="mt-2 space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <span>Initial recruiter screen (30 min)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <span>Technical screen with hiring manager (45 min)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </span>
                    <span>Take-home coding assignment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      4
                    </span>
                    <span>On-site interviews (4-5 hours)</span>
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                <textarea
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Add notes about this job application..."
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Application Date</h3>
                <p className="mt-2 text-gray-600">{job.applicationDate}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Status</h3>
                <select className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Got Interview</option>
                  <option>In Process</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <div>
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50">
              Delete
            </button>
          </div>
          <div className="space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};