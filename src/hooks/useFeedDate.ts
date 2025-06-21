import { useMemo } from 'react';
import { formatTimeAgo } from '@/lib/utils';

interface Feed {
  created_at: string;
  updated_at?: string;
}

export function useFeedDate(feed: Feed | null) {
  const feedDate = useMemo(() => {
    if (!feed) return '';
    
    const createdDate = new Date(feed.created_at);
    const updatedDate = feed.updated_at ? new Date(feed.updated_at) : createdDate;
    
    // Return the most recent date between created_at and updated_at
    return updatedDate > createdDate ? updatedDate : createdDate;
  }, [feed]);

  const formattedDate = useMemo(() => {
    if (!feedDate) return '';
    return formatTimeAgo(feedDate);
  }, [feedDate]);

  return {
    feedDate,
    formattedDate
  };
} 