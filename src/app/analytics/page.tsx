'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Calendar, ChevronDown, TrendingUp, Users, Briefcase } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { AuthWrapper } from '../AuthWrapper';

// Mock data - would be replaced with actual data from useJobs hook
const applicationData = [
  { month: 'Jan', applications: 5, interviews: 2, offers: 0 },
  { month: 'Feb', applications: 8, interviews: 3, offers: 1 },
  { month: 'Mar', applications: 12, interviews: 5, offers: 2 },
  { month: 'Apr', applications: 15, interviews: 7, offers: 1 },
  { month: 'May', applications: 10, interviews: 4, offers: 0 },
  { month: 'Jun', applications: 7, interviews: 3, offers: 1 },
];

const statusData = [
  { name: 'Got Interview', value: 25, color: '#4F46E5' },
  { name: 'In Process', value: 15, color: '#7C3AED' },
  { name: 'Accepted', value: 5, color: '#10B981' },
  { name: 'Rejected', value: 12, color: '#EF4444' },
];

const companySizeData = [
  { name: 'Startup', value: 20 },
  { name: 'Mid-size', value: 30 },
  { name: 'Enterprise', value: 15 },
];

const responseTimeData = [
  { day: '1', time: 2 },
  { day: '2', time: 5 },
  { day: '3', time: 3 },
  { day: '4', time: 7 },
  { day: '5', time: 2 },
  { day: '6', time: 6 },
  { day: '7', time: 4 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  // Calculate summary statistics
  const totalApplications = applicationData.reduce((sum, item) => sum + item.applications, 0);
  const totalInterviews = applicationData.reduce((sum, item) => sum + item.interviews, 0);
  const totalOffers = applicationData.reduce((sum, item) => sum + item.offers, 0);
  const responseRate = Math.round((totalInterviews / totalApplications) * 100);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Application Analytics</h1>
          <div className="mt-4 md:mt-0 flex items-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              {timeRange}
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalApplications}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Interviews</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalInterviews}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Response Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">{responseRate}%</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <Calendar size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Offers</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalOffers}</h3>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Application Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Timeline</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" name="Applications" fill="#4F46E5" />
                  <Bar dataKey="interviews" name="Interviews" fill="#7C3AED" />
                  <Bar dataKey="offers" name="Offers" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Size Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Company Size Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={companySizeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Applications" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Average Response Time (Days)
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={responseTimeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="time"
                    name="Days"
                    stroke="#0EA5E9"
                    fill="#0EA5E9"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
}