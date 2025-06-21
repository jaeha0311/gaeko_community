'use client';

import { useFeeds, useCreateFeed } from '@/hooks/useFeeds';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types/user';

export default function TestPage() {
  const { data: feeds, isLoading, error } = useFeeds();
  const createFeedMutation = useCreateFeed();
  const [content, setContent] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('checking');

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Auth error:', error);
          setAuthStatus('error');
        } else if (user) {
          setUser(user);
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('not_authenticated');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthStatus('error');
      }
    };

    checkAuth();
  }, []);

  const handleCreateFeed = async () => {
    console.log('Create feed clicked');
    console.log('Content:', content);
    console.log('User:', user);
    console.log('Auth status:', authStatus);
    
    if (!content.trim()) {
      alert('내용을 입력해주세요');
      return;
    }

    if (!user) {
      alert('게시글을 작성하려면 로그인이 필요해요');
      return;
    }

    try {
      await createFeedMutation.mutateAsync({ contents: content });
      setContent('');
      console.log('Feed created successfully');
    } catch (err) {
      console.error('Create feed error:', err);
      alert(`게시글 작성 중 문제가 발생했어요: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Sign in error:', error);
        alert(`로그인 중 문제가 발생했어요: ${error.message}`);
      } else {
        console.log('Signed in anonymously');
      }
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  if (isLoading) return <div>게시글을 불러오는 중...</div>;
  if (error) return <div>오류가 발생했어요: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">게코랜드 테스트 페이지 🦎</h1>
      
      {/* Auth Status */}
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">로그인 상태</h2>
        <p>상태: {authStatus === 'authenticated' ? '로그인됨' : authStatus === 'not_authenticated' ? '로그인 안됨' : '확인 중'}</p>
        {user && (
          <p>사용자 ID: {user.id}</p>
        )}
        {authStatus === 'not_authenticated' && (
          <button
            onClick={handleSignIn}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            익명으로 로그인
          </button>
        )}
      </div>

      {/* Create Feed Form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">새 게시글 작성</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="게코와 함께한 특별한 순간을 공유해보세요! 🦎"
            className="flex-1 p-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFeed()}
          />
          <button
            onClick={handleCreateFeed}
            disabled={createFeedMutation.isPending || !user}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {createFeedMutation.isPending ? '작성 중...' : '게시하기'}
          </button>
        </div>
        {createFeedMutation.error && (
          <p className="mt-2 text-red-500">
            오류: {createFeedMutation.error.message}
          </p>
        )}
        {createFeedMutation.isSuccess && (
          <p className="mt-2 text-green-500">
            게시글이 성공적으로 작성되었어요!
          </p>
        )}
      </div>

      {/* Feeds List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">게시글 목록 ({feeds?.length || 0}개)</h2>
        {feeds && feeds.length > 0 ? (
          <div className="space-y-4">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{feed.user?.username || feed.user?.email || '게코 친구'}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(feed.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p>{feed.contents}</p>
                <div className="mt-2 text-sm text-gray-500">
                  ❤️ {feed.likes?.length || 0} | 💬 {feed.comments_count || 0}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 게시글이 없어요. 위에서 첫 번째 게시글을 작성해보세요!</p>
        )}
      </div>
    </div>
  );
} 