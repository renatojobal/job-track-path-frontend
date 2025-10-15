import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          position: string | null;
          company_description: string | null;
          tech_stack: string[] | null;
          salary_min: number | null;
          salary_max: number | null;
          bonus_rsu: string | null;
          raises: string | null;
          year_end_bonus: string | null;
          additional_benefits: string | null;
          health_insurance: string | null;
          vacation_days: number | null;
          holidays: string | null;
          work_mode: 'remote' | 'hybrid' | 'onsite' | null;
          laptop_provided: boolean | null;
          payment_method: string | null;
          interview_process: string | null;
          notes: string | null;
          status: 'got_interview' | 'in_process' | 'accepted' | 'rejected';
          application_date: string;
          created_at: string;
          updated_at: string;
          position_order: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          position?: string | null;
          company_description?: string | null;
          tech_stack?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          bonus_rsu?: string | null;
          raises?: string | null;
          year_end_bonus?: string | null;
          additional_benefits?: string | null;
          health_insurance?: string | null;
          vacation_days?: number | null;
          holidays?: string | null;
          work_mode?: 'remote' | 'hybrid' | 'onsite' | null;
          laptop_provided?: boolean | null;
          payment_method?: string | null;
          interview_process?: string | null;
          notes?: string | null;
          status?: 'got_interview' | 'in_process' | 'accepted' | 'rejected';
          application_date?: string;
          created_at?: string;
          updated_at?: string;
          position_order?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          position?: string | null;
          company_description?: string | null;
          tech_stack?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          bonus_rsu?: string | null;
          raises?: string | null;
          year_end_bonus?: string | null;
          additional_benefits?: string | null;
          health_insurance?: string | null;
          vacation_days?: number | null;
          holidays?: string | null;
          work_mode?: 'remote' | 'hybrid' | 'onsite' | null;
          laptop_provided?: boolean | null;
          payment_method?: string | null;
          interview_process?: string | null;
          notes?: string | null;
          status?: 'got_interview' | 'in_process' | 'accepted' | 'rejected';
          application_date?: string;
          created_at?: string;
          updated_at?: string;
          position_order?: number | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          conversation_date: string;
          response_date: string | null;
          full_name: string;
          phone: string | null;
          email: string | null;
          status: 'pending' | 'responded' | 'closed' | 'follow_up';
          notes: string | null;
          channel: 'whatsapp' | 'email' | 'linkedin' | 'phone' | 'other';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          conversation_date: string;
          response_date?: string | null;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          status?: 'pending' | 'responded' | 'closed' | 'follow_up';
          notes?: string | null;
          channel: 'whatsapp' | 'email' | 'linkedin' | 'phone' | 'other';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          conversation_date?: string;
          response_date?: string | null;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          status?: 'pending' | 'responded' | 'closed' | 'follow_up';
          notes?: string | null;
          channel?: 'whatsapp' | 'email' | 'linkedin' | 'phone' | 'other';
          created_at?: string;
          updated_at?: string;
        };
      };
      job_conversations: {
        Row: {
          job_id: string;
          conversation_id: string;
        };
        Insert: {
          job_id: string;
          conversation_id: string;
        };
        Update: {
          job_id?: string;
          conversation_id?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}