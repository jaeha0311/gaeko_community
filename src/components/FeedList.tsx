'use client';

import { useFeeds, useLikeFeed, useUnlikeFeed } from '@/hooks/useFeeds';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export function FeedList() {
  const { data: feeds, isLoading, error } = useFeeds();
  const likeFeedMutation = useLikeFeed();
  const unlikeFeedMutation = useUnlikeFeed();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    getUser();
  }, []);

  if (isLoading) return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🦎</div>
      <p className="text-gray-600">게코 친구들의 이야기를 불러오는 중...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">😅</div>
      <p className="text-red-500">문제가 발생했어요: {error.message}</p>
    </div>
  );

  const handleLike = (feedId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeFeedMutation.mutate(feedId);
    } else {
      likeFeedMutation.mutate(feedId);
    }
  };

  return (
    <div className="space-y-6">
      {feeds && feeds.length > 0 ? (
        feeds.map((feed) => {
          const isLiked = currentUser ? feed.likes.includes(currentUser) : false;
          
          return (
            <div key={feed.id} className="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                {feed.user.avatar_url ? (
                  <Image
                    src={feed.user.avatar_url}
                    alt="프로필"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-green-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {feed.user.username?.charAt(0) || feed.user.email?.charAt(0) || '게'}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900">
                    {feed.user.username || feed.user.email?.split('@')[0] || '게코 친구'}
                  </span>
                  <div className="text-sm text-gray-500">
                    {new Date(feed.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              <p className="mb-4 text-gray-800 leading-relaxed">{feed.contents}</p>
              
              {feed.images && feed.images.length > 0 && (
                <div className="mb-4">
                  {feed.images.map((image, index) => (
                    <Image 
                      key={index} 
                      src={image} 
                      alt={`게코 사진 ${index + 1}`}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 border-t border-green-100 pt-4">
                <button
                  onClick={() => handleLike(feed.id, isLiked)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                  }`}
                >
                  <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                  <span>{feed.likes.length}명이 좋아해요</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💬</span>
                  <span>{feed.comments_count || 0}개의 댓글</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🦎</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            아직 게시글이 없어요!
          </h3>
          <p className="text-gray-600">
            첫 번째 게시글을 작성해서 게코 친구들과 소통을 시작해보세요 ✨
          </p>
        </div>
      )}
    </div>
  );
} 