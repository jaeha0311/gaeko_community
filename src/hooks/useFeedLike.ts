import { useState, useEffect } from 'react';
import { useLikeFeed, useUnlikeFeed } from '@/hooks/useFeeds';
import { supabase } from '@/lib/supabaseClient';

interface Feed {
  id: string;
  likes: string[];
}

export function useFeedLike(feed: Feed | null) {
  const likeFeedMutation = useLikeFeed();
  const unlikeFeedMutation = useUnlikeFeed();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [localLikes, setLocalLikes] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState(false);

  // Get current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    getUser();
  }, []);

  // Update local likes when feed data changes
  useEffect(() => {
    if (feed) {
      setLocalLikes(feed.likes || []);
    }
  }, [feed]);

  const handleLike = async (feedId: string) => {
    if (!currentUser || isLiking) return;
    
    setIsLiking(true);
    const isCurrentlyLiked = localLikes.includes(currentUser);
    
    // Optimistic update
    if (isCurrentlyLiked) {
      setLocalLikes(prev => prev.filter(id => id !== currentUser));
    } else {
      setLocalLikes(prev => [...prev, currentUser]);
    }

    try {
      if (isCurrentlyLiked) {
        await unlikeFeedMutation.mutateAsync(feedId);
      } else {
        await likeFeedMutation.mutateAsync(feedId);
      }
    } catch (error) {
      // Revert optimistic update on error
      if (isCurrentlyLiked) {
        setLocalLikes(prev => [...prev, currentUser]);
      } else {
        setLocalLikes(prev => prev.filter(id => id !== currentUser));
      }
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = currentUser ? localLikes.includes(currentUser) : false;

  return {
    currentUser,
    localLikes,
    isLiked,
    isLiking,
    handleLike
  };
} 