import { supabase } from '@/lib/supabaseClient';
import { 
  CreateCommentRequest, 
  UpdateCommentRequest, 
  CommentWithUser,
  Database 
} from '@/types/feed';

// Get comments for a feed
export const getCommentsByFeedId = async (feedId: string): Promise<CommentWithUser[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users(*)
    `)
    .eq('feed_id', feedId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }

  return data || [];
};

// Get comment by ID
export const getCommentById = async (id: string): Promise<CommentWithUser | null> => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch comment: ${error.message}`);
  }

  return data;
};

// Create new comment
export const createComment = async (
  feedId: string, 
  commentData: CreateCommentRequest
): Promise<Database['public']['Tables']['comments']['Row']> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      feed_id: feedId,
      user_id: user.id,
      content: commentData.content,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  return data;
};

// Update comment
export const updateComment = async (
  id: string, 
  commentData: UpdateCommentRequest
): Promise<Database['public']['Tables']['comments']['Row']> => {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content: commentData.content,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update comment: ${error.message}`);
  }

  return data;
};

// Delete comment
export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}; 