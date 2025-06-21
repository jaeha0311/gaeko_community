import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/feed';

// Get current user profile
export const getCurrentUser = async (): Promise<Database['public']['Tables']['users']['Row'] | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return data;
};

// Update user profile
export const updateUserProfile = async (
  profileData: Partial<Database['public']['Tables']['users']['Update']>
): Promise<Database['public']['Tables']['users']['Row']> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }

  return data;
};

// Get user by ID
export const getUserById = async (userId: string): Promise<Database['public']['Tables']['users']['Row'] | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
};

// Get user feeds count
export const getUserFeedsCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('feeds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to fetch user feeds count: ${error.message}`);
  }

  return count || 0;
}; 