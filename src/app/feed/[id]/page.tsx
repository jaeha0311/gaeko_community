'use client';

import Image from "next/image"
import { Heart, MessageCircle, Bell, Menu, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeed } from '@/hooks/useFeeds';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useState, use, useRef, useEffect } from 'react';
import { useFeedDate } from '@/hooks/useFeedDate';
import { useFeedLike } from '@/hooks/useFeedLike';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useRouteTransition } from '@/hooks/useRouteTransition';
import { WithBottomMenu } from '@/components/hoc/withBottomMenu';

interface FeedDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FeedDetailPage({ params }: FeedDetailPageProps) {
  const { goBack } = useRouteTransition();
  const { id } = use(params);
  const { data: feed, isLoading: feedLoading, error: feedError, refetch: refetchFeed } = useFeed(id);
  const { data: comments, isLoading: commentsLoading, refetch: refetchComments } = useComments(id);
  const createCommentMutation = useCreateComment();
  const [newComment, setNewComment] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const { formattedDate } = useFeedDate(feed || null);
  const { currentUser, localLikes, isLiked, handleLike } = useFeedLike(feed || null);

  const handleRefresh = async () => {
    await Promise.all([
      refetchFeed(),
      refetchComments()
    ]);
  };

  const { isRefreshing, pullDistance, attachListeners } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5
  });

  useEffect(() => {
    if (scrollContainerRef.current) {
      return attachListeners(scrollContainerRef.current);
    }
  }, [attachListeners]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      await createCommentMutation.mutateAsync({
        feedId: id,
        data: { content: newComment.trim() }
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  if (feedLoading) {
    return (
      <WithBottomMenu>
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[600px] mx-auto bg-[#ffffff] min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#ffffff] border-b border-[#f0f2f5] shadow-sm">
              <Button variant="ghost" size="icon" className="text-[#121417]" onClick={goBack}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-[#121417] font-semibold text-lg">게시글</h1>
              <div className="w-10"></div>
            </header>
            <div className="flex-1 overflow-y-auto px-4 pb-20">
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🦎</div>
                <p className="text-[#61758a]">게시글을 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </WithBottomMenu>
    );
  }

  if (feedError || !feed) {
    return (
      <WithBottomMenu>
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[600px] mx-auto bg-[#ffffff] min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#ffffff] border-b border-[#f0f2f5] shadow-sm">
              <Button variant="ghost" size="icon" className="text-[#121417]" onClick={goBack}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-[#121417] font-semibold text-lg">게시글</h1>
              <div className="w-10"></div>
            </header>
            <div className="flex-1 overflow-y-auto px-4 pb-20">
              <div className="text-center py-12">
                <div className="text-4xl mb-4">😅</div>
                <p className="text-red-500">게시글을 찾을 수 없어요: {feedError?.message}</p>
              </div>
            </div>
          </div>
        </div>
      </WithBottomMenu>
    );
  }

  return (
    <WithBottomMenu>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[600px] mx-auto bg-[#ffffff] min-h-screen flex flex-col">
          {/* Sticky Header */}
          <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#ffffff] border-b border-[#f0f2f5] shadow-sm">
            <Button variant="ghost" size="icon" className="text-[#121417]" onClick={goBack}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-[#121417] font-semibold text-lg">게시글</h1>
            <Button variant="ghost" size="icon" className="text-[#121417]">
              <Menu className="h-6 w-6" />
            </Button>
          </header>

          {/* Pull to Refresh Indicator */}
          {pullDistance > 0 && (
            <div 
              className="flex items-center justify-center py-4 bg-[#f8f9fa] border-b border-[#f0f2f5] transition-all duration-200"
              style={{ 
                transform: `translateY(${Math.min(pullDistance, 80)}px)`,
                opacity: Math.min(pullDistance / 80, 1)
              }}
            >
              <div className="flex items-center gap-2 text-[#61758a]">
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">새로고침 중...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span className="text-sm">당겨서 새로고침</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Scrollable Content Area */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 pb-20"
            style={{
              transform: `translateY(${Math.min(pullDistance, 80)}px)`,
              transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
            }}
          >
            {/* Feed Post */}
            <div className="mb-6 pt-4">
              {feed.images && feed.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={feed.images[0]}
                    alt="Crested gecko post image"
                    width={350}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <h2 className="text-[#121417] font-bold text-lg mb-2">
                {feed.contents.length > 50 
                  ? `${feed.contents.substring(0, 50)}...` 
                  : feed.contents
                }
              </h2>
              <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
                {feed.contents}
              </p>
              <p className="text-[#61758a] text-sm mb-3">
                By @{feed.user.username || feed.user.email?.split('@')[0] || '게코 친구'}
              </p>

              {/* Time display */}
              <p className="text-[#61758a] text-xs mb-3">
                {formattedDate}
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(feed.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-[#61758a]'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{localLikes.length}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-5 w-5 text-[#61758a]" />
                  <span className="text-[#61758a] text-sm">{feed.comments_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bell className="h-5 w-5 text-[#61758a]" />
                  <span className="text-[#61758a] text-sm">0</span>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="border-t border-[#f0f2f5] pt-6">
              <h3 className="text-[#121417] font-semibold text-lg mb-4">댓글</h3>
              
              {/* Comment Input */}
              {currentUser && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 작성해보세요..."
                      className="flex-1 px-4 py-2 border border-[#f0f2f5] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={createCommentMutation.isPending}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newComment.trim() || createCommentMutation.isPending}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {createCommentMutation.isPending ? '작성 중...' : '작성'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              {commentsLoading && !isRefreshing ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-[#61758a]">댓글을 불러오는 중...</p>
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-[#f8f9fa] rounded-lg">
                      <div className="flex-shrink-0">
                        {comment.user.avatar_url ? (
                          <Image
                            src={comment.user.avatar_url}
                            alt="프로필"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full border-2 border-green-200"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">
                              {comment.user.username?.charAt(0) || comment.user.email?.charAt(0) || '게'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#121417] text-sm">
                            {comment.user.username || comment.user.email?.split('@')[0] || '게코 친구'}
                          </span>
                          <span className="text-[#61758a] text-xs">
                            {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-[#121417] text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-[#61758a]">아직 댓글이 없어요!</p>
                  <p className="text-[#61758a] text-sm">첫 번째 댓글을 작성해보세요 ✨</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WithBottomMenu>
  )
} 