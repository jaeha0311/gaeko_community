'use client';

import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomMenu from "../ui/BottomMenu"
import { useFeeds } from '@/hooks/useFeeds';
import { useRouter } from 'next/navigation';
import FeedItem from '../FeedItem';

export default function Component() {
  const router = useRouter();
  const { data: feeds, isLoading, error } = useFeeds();

  const handleFeedClick = (feedId: string) => {
    router.push(`/feed/${feedId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[600px] mx-auto bg-[#ffffff] min-h-screen flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#ffffff] border-b border-[#f0f2f5] shadow-sm">
          <Button variant="ghost" size="icon" className="text-[#121417]">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-[#121417] font-semibold text-lg">Crested Gecko Community</h1>
          <Button variant="ghost" size="icon" className="text-[#121417]">
            <Search className="h-6 w-6" />
          </Button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🦎</div>
              <p className="text-[#61758a]">게코 친구들의 이야기를 불러오는 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">😅</div>
              <p className="text-red-500">문제가 발생했어요: {error.message}</p>
            </div>
          )}

          {/* Feed Posts */}
          {!isLoading && !error && feeds && feeds.length > 0 && (
            feeds.map((feed) => (
              <FeedItem 
                key={feed.id} 
                feed={{
                  ...feed,
                  user: {
                    username: feed.user.username || undefined,
                    email: feed.user.email || undefined
                  }
                }}
                onFeedClick={handleFeedClick}
              />
            ))
          )}

          {/* Empty State */}
          {!isLoading && !error && feeds && feeds.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🦎</div>
              <h3 className="text-xl font-semibold text-[#121417] mb-2">
                아직 게시글이 없어요!
              </h3>
              <p className="text-[#61758a]">
                첫 번째 게시글을 작성해서 게코 친구들과 소통을 시작해보세요 ✨
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomMenu />
      </div>
    </div>
  )
}
