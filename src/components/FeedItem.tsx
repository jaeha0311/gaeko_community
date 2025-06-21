'use client';

import Image from "next/image"
import { Heart, MessageCircle, Bell } from "lucide-react"
import { useFeedDate } from '@/hooks/useFeedDate';
import { useFeedLike } from '@/hooks/useFeedLike';

interface FeedItemProps {
  feed: {
    id: string;
    contents: string;
    images?: string[];
    likes: string[];
    comments_count?: number;
    created_at: string;
    updated_at?: string;
    user: {
      username?: string;
      email?: string;
    };
  };
  onFeedClick: (feedId: string) => void;
}

export default function FeedItem({ feed, onFeedClick }: FeedItemProps) {
  const { formattedDate } = useFeedDate(feed);
  const { isLiked, localLikes, handleLike } = useFeedLike(feed);

  return (
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
      <div 
        className="cursor-pointer"
        onClick={() => onFeedClick(feed.id)}
      >
        <h2 className="text-[#121417] font-bold text-lg mb-2">
          {feed.contents.length > 50 
            ? `${feed.contents.substring(0, 50)}...` 
            : feed.contents
          }
        </h2>
        <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
          {feed.contents}
        </p>
        <p className="text-[#61758a] text-sm mb-1">
          By @{feed.user.username || feed.user.email?.split('@')[0] || '게코 친구'}
        </p>
        {/* Time display */}
        <p className="text-[#61758a] text-xs mb-3">
          {formattedDate}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(feed.id);
          }}
          className={`flex items-center gap-1 transition-colors ${
            isLiked ? 'text-red-500' : 'text-[#61758a]'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{localLikes.length}</span>
        </button>
        <button
          onClick={() => onFeedClick(feed.id)}
          className="flex items-center gap-1 text-[#61758a] hover:text-[#121417] transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{feed.comments_count || 0}</span>
        </button>
        <div className="flex items-center gap-1">
          <Bell className="h-5 w-5 text-[#61758a]" />
          <span className="text-[#61758a] text-sm">0</span>
        </div>
      </div>
    </div>
  );
} 