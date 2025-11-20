import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          code: string;
          status: 'active' | 'blocked' | 'inactive';
          email: string | null;
          phone: string | null;
          address: string | null;
          max_students: number;
          max_teachers: number;
          max_staff: number;
          subscription_plan: string;
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['schools']['Insert']>;
      };
      school_users: {
        Row: {
          id: string;
          school_id: string;
          user_type: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
          full_name: string;
          email: string | null;
          phone: string | null;
          status: 'active' | 'inactive' | 'suspended';
          permissions: Record<string, unknown>;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          school_id: string;
          parent_id: string | null;
          student_id: string | null;
          amount: number;
          currency: string;
          payment_type: string;
          payment_method: string | null;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          description: string | null;
          transaction_id: string | null;
          paid_at: string | null;
          created_at: string;
        };
      };
      platform_integrations: {
        Row: {
          id: string;
          school_id: string;
          platform_name: string;
          platform_type: 'mobile' | 'web' | 'desktop' | 'api';
          status: 'active' | 'inactive' | 'maintenance';
          api_key: string | null;
          config: Record<string, unknown>;
          active_users_count: number;
          last_sync: string | null;
          created_at: string;
        };
      };
      super_admins: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: 'super_admin' | 'admin' | 'viewer';
          permissions: Record<string, unknown>;
          created_at: string;
        };
      };
    };
  };
};
