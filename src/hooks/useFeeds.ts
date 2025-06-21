/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getFeeds, 
  getFeedById, 
  getFeedsByUserId, 
  createFeed, 
  updateFeed, 
  deleteFeed,
  likeFeed,
  unlikeFeed
} from '@/lib/api/feeds';
import { UpdateFeedRequest } from '@/types/feed';

// Query Keys
export const feedKeys = {
  all: ['feeds'] as const,
  lists: () => [...feedKeys.all, 'list'] as const,
  list: (filters: string) => [...feedKeys.lists(), { filters }] as const,
  details: () => [...feedKeys.all, 'detail'] as const,
  detail: (id: string) => [...feedKeys.details(), id] as const,
  userFeeds: (userId: string) => [...feedKeys.all, 'user', userId] as const,
};

// Get all feeds
export const useFeeds = () => {
  return useQuery({
    queryKey: feedKeys.lists(),
    queryFn: getFeeds,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get feed by ID
export const useFeed = (id: string) => {
  return useQuery({
    queryKey: feedKeys.detail(id),
    queryFn: () => getFeedById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get feeds by user ID
export const useUserFeeds = (userId: string) => {
  return useQuery({
    queryKey: feedKeys.userFeeds(userId),
    queryFn: () => getFeedsByUserId(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create feed mutation
export const useCreateFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeed,
    onSuccess: () => {
      // Invalidate and refetch feeds lists
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

// Update feed mutation
export const useUpdateFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeedRequest }) =>
      updateFeed(id, data),
    onSuccess: (data) => {
      // Update the specific feed in cache
      queryClient.setQueryData(feedKeys.detail(data.id), data);
      // Invalidate feeds lists
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

// Delete feed mutation
export const useDeleteFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeed,
    onSuccess: (_, deletedId) => {
      // Remove the feed from cache
      queryClient.removeQueries({ queryKey: feedKeys.detail(deletedId) });
      // Invalidate feeds lists
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

// Like feed mutation
export const useLikeFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeFeed,
    onSuccess: (_, feedId) => {
      // Optimistically update the feed in cache
      queryClient.setQueryData(feedKeys.detail(feedId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          likes: [...old.likes, 'current-user-id'], // You'll need to get the actual user ID
        };
      });
      // Invalidate feeds lists
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

// Unlike feed mutation
export const useUnlikeFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikeFeed,
    onSuccess: (_, feedId) => {
      // Optimistically update the feed in cache
      queryClient.setQueryData(feedKeys.detail(feedId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          likes: old.likes.filter((id: string) => id !== 'current-user-id'), // You'll need to get the actual user ID
        };
      });
      // Invalidate feeds lists
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
}; 