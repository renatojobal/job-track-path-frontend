'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/types';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations from Supabase
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          job_conversations (
            job_id
          )
        `)
        .order('conversation_date', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to our Conversation interface
      const transformedConversations: Conversation[] = data.map((conv) => ({
        id: conv.id,
        conversationDate: conv.conversation_date,
        responseDate: conv.response_date || undefined,
        fullName: conv.full_name,
        phone: conv.phone || undefined,
        email: conv.email || undefined,
        status: conv.status,
        notes: conv.notes || undefined,
        channel: conv.channel,
        linkedJobs: conv.job_conversations?.map((jc: any) => jc.job_id) || [],
      }));

      setConversations(transformedConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  // Add a new conversation
  const addConversation = async (conversationData: Omit<Conversation, 'id' | 'linkedJobs'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          conversation_date: conversationData.conversationDate,
          response_date: conversationData.responseDate,
          full_name: conversationData.fullName,
          phone: conversationData.phone,
          email: conversationData.email,
          status: conversationData.status,
          notes: conversationData.notes,
          channel: conversationData.channel,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newConversation: Conversation = {
        id: data.id,
        conversationDate: data.conversation_date,
        responseDate: data.response_date || undefined,
        fullName: data.full_name,
        phone: data.phone || undefined,
        email: data.email || undefined,
        status: data.status,
        notes: data.notes || undefined,
        channel: data.channel,
        linkedJobs: [],
      };

      setConversations((prev) => [newConversation, ...prev]);
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add conversation');
      throw err;
    }
  };

  // Update conversation
  const updateConversation = async (conversationId: string, updates: Partial<Conversation>) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          response_date: updates.responseDate,
          full_name: updates.fullName,
          phone: updates.phone,
          email: updates.email,
          status: updates.status,
          notes: updates.notes,
          channel: updates.channel,
        })
        .eq('id', conversationId);

      if (error) throw error;

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, ...updates } : conv
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
      throw err;
    }
  };

  // Link conversation to job
  const linkConversationToJob = async (conversationId: string, jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_conversations')
        .insert({
          conversation_id: conversationId,
          job_id: jobId,
        });

      if (error) throw error;

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, linkedJobs: [...conv.linkedJobs, jobId] }
            : conv
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link conversation to job');
      throw err;
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      // Remove from local state
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
      throw err;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    addConversation,
    updateConversation,
    linkConversationToJob,
    deleteConversation,
    refetch: fetchConversations,
  };
};