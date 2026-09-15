import { supabase, isSupabaseConfigured } from './client';

export interface ActivityLogInput {
  action: string;
  user_id?: string | null;
  user_email?: string | null;
  details?: Record<string, any>;
}

export async function logUserActivity({
  action,
  user_id,
  user_email,
  details = {},
}: ActivityLogInput): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('user_activity_logs').insert({
      action,
      user_id: user_id || null,
      user_email: user_email || null,
      details,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to log user activity to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error logging activity to Supabase:', err);
    return false;
  }
}
