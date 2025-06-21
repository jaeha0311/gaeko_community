import { supabase } from '@/lib/supabaseClient';
import { 
  CreateFeedRequest, 
  UpdateFeedRequest, 
  FeedWithUser,
  Database 
} from '@/types/feed';

// Get all feeds with user information
export const getFeeds = async (): Promise<FeedWithUser[]> => {
  const { data, error } = await supabase
    .from('feeds')
    .select(`
      *,
      user:users(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch feeds: ${error.message}`);
  }

  // Get comment counts for each feed
  const feedsWithCounts = await Promise.all(
    (data || []).map(async (feed) => {
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('feed_id', feed.id);

      return {
        ...feed,
        comments_count: commentsCount || 0,
        likes_count: feed.likes.length
      };
    })
  );

  return feedsWithCounts;
};

// Get feed by ID with user information
export const getFeedById = async (id: string): Promise<FeedWithUser | null> => {
  const { data, error } = await supabase
    .from('feeds')
    .select(`
      *,
      user:users(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch feed: ${error.message}`);
  }

  if (!data) return null;

  // Get comment count
  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('feed_id', data.id);

  return {
    ...data,
    comments_count: commentsCount || 0,
    likes_count: data.likes.length
  };
};

// Get feeds by user ID
export const getFeedsByUserId = async (userId: string): Promise<FeedWithUser[]> => {
  const { data, error } = await supabase
    .from('feeds')
    .select(`
      *,
      user:users(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user feeds: ${error.message}`);
  }

  // Get comment counts for each feed
  const feedsWithCounts = await Promise.all(
    (data || []).map(async (feed) => {
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('feed_id', feed.id);

      return {
        ...feed,
        comments_count: commentsCount || 0,
        likes_count: feed.likes.length
      };
    })
  );

  return feedsWithCounts;
};

// Create new feed
export const createFeed = async (feedData: CreateFeedRequest): Promise<Database['public']['Tables']['feeds']['Row']> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('feeds')
    .insert({
      user_id: user.id,
      contents: feedData.contents,
      images: feedData.images || [],
      emojies: feedData.emojies || [],
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create feed: ${error.message}`);
  }

  return data;
};

// Update feed
export const updateFeed = async (
  id: string, 
  feedData: UpdateFeedRequest
): Promise<Database['public']['Tables']['feeds']['Row']> => {
  const { data, error } = await supabase
    .from('feeds')
    .update({
      contents: feedData.contents,
      images: feedData.images,
      emojies: feedData.emojies,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update feed: ${error.message}`);
  }

  return data;
};

// Delete feed
export const deleteFeed = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('feeds')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete feed: ${error.message}`);
  }
};

// Like feed
export const likeFeed = async (feedId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: feed } = await supabase
    .from('feeds')
    .select('likes')
    .eq('id', feedId)
    .single();

  if (!feed) {
    throw new Error('Feed not found');
  }

  const updatedLikes = feed.likes.includes(user.id) 
    ? feed.likes 
    : [...feed.likes, user.id];

  const { error } = await supabase
    .from('feeds')
    .update({ likes: updatedLikes })
    .eq('id', feedId);

  if (error) {
    throw new Error(`Failed to like feed: ${error.message}`);
  }
};

// Unlike feed
export const unlikeFeed = async (feedId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: feed } = await supabase
    .from('feeds')
    .select('likes')
    .eq('id', feedId)
    .single();

  if (!feed) {
    throw new Error('Feed not found');
  }

  const updatedLikes = feed.likes.filter(id => id !== user.id);

  const { error } = await supabase
    .from('feeds')
    .update({ likes: updatedLikes })
    .eq('id', feedId);

  if (error) {
    throw new Error(`Failed to unlike feed: ${error.message}`);
  }
}; 