import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCommentsByFeedId, 
  getCommentById, 
  createComment, 
  updateComment, 
  deleteComment 
} from '@/lib/api/comments';
import { CreateCommentRequest, UpdateCommentRequest, CommentWithUser } from '@/types/feed';

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (feedId: string) => [...commentKeys.lists(), feedId] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

// Get comments by feed ID
export const useComments = (feedId: string) => {
  return useQuery({
    queryKey: commentKeys.list(feedId),
    queryFn: () => getCommentsByFeedId(feedId),
    enabled: !!feedId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get comment by ID
export const useComment = (id: string) => {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => getCommentById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedId, data }: { feedId: string; data: CreateCommentRequest }) =>
      createComment(feedId, data),
    onSuccess: (_, { feedId }) => {
      // Invalidate comments for this feed
      queryClient.invalidateQueries({ queryKey: commentKeys.list(feedId) });
      // Also invalidate the feed to update comment count
      queryClient.invalidateQueries({ queryKey: ['feeds', 'detail', feedId] });
    },
  });
};

// Update comment mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentRequest }) =>
      updateComment(id, data),
    onSuccess: (data) => {
      // Update the specific comment in cache
      queryClient.setQueryData(commentKeys.detail(data.id), data);
      // Invalidate comments lists for this feed
      queryClient.invalidateQueries({ queryKey: commentKeys.list(data.feed_id) });
    },
  });
};

// Delete comment mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, deletedId) => {
      // Remove the comment from cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(deletedId) });
      // Invalidate all comment lists (since we don't know which feed it belonged to)
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}; 