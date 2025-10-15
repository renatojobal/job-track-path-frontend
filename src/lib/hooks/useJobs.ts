'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to our Job interface
      const transformedJobs: Job[] = data.map((job) => ({
        id: job.id,
        company: job.company,
        position: job.position || '',
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
          : job.salary_min 
          ? `$${job.salary_min.toLocaleString()}+`
          : 'Salary not specified',
        techStack: job.tech_stack || [],
        workMode: job.work_mode === 'remote' ? 'Remote' : 
                  job.work_mode === 'hybrid' ? 'Hybrid' : 
                  job.work_mode === 'onsite' ? 'On-site' : 'Remote',
        applicationDate: job.application_date,
        status: job.status,
      }));

      setJobs(transformedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Add a new job
  const addJob = async (jobData: Omit<Job, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          company: jobData.company,
          position: jobData.position,
          tech_stack: jobData.techStack,
          work_mode: jobData.workMode.toLowerCase() as 'remote' | 'hybrid' | 'onsite',
          status: jobData.status,
          application_date: jobData.applicationDate,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newJob: Job = {
        id: data.id,
        company: data.company,
        position: data.position || '',
        salary: 'Salary not specified',
        techStack: data.tech_stack || [],
        workMode: data.work_mode === 'remote' ? 'Remote' : 
                  data.work_mode === 'hybrid' ? 'Hybrid' : 'On-site',
        applicationDate: data.application_date,
        status: data.status,
      };

      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add job');
      throw err;
    }
  };

  // Update job status (for drag and drop)
  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobs((prev) => 
        prev.map((job) => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
      throw err;
    }
  };

  // Delete a job
  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      // Remove from local state
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      throw err;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    addJob,
    updateJobStatus,
    deleteJob,
    refetch: fetchJobs,
  };
};