'use client';

import { useCreateFeed } from '@/hooks/useFeeds';
import { useState } from 'react';

export function CreateFeedForm() {
  const createFeedMutation = useCreateFeed();
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    try {
      await createFeedMutation.mutateAsync({ contents: content });
      setContent('');
    } catch (error) {
      console.error('Error creating feed:', error);
    }
  };

  return (
    <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">게코 이야기 나누기</h2>
        <span className="text-2xl">🦎</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 게코와 함께한 특별한 순간을 공유해보세요! 🦎✨"
            className="w-full p-4 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-green-50"
            rows={3}
            maxLength={500}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {content.length}/500자
            </span>
            <button
              type="submit"
              disabled={createFeedMutation.isPending || !content.trim()}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {createFeedMutation.isPending ? '게시 중...' : '게시하기'}
            </button>
          </div>
          
          {createFeedMutation.error && (
            <p className="text-red-500 text-sm">
              게시 중 문제가 발생했어요: {createFeedMutation.error.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
} 