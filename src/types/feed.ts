export interface FeedItem {
  id: string;
  userId: string;
  images: string[];
  contents: string;
  likes: string[]; // Array of user IDs
  comments: string[]; // Array of comment IDs
  emojies: string[];
  createdAt: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          tag: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          tag?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          tag?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      feeds: {
        Row: {
          id: string;
          user_id: string;
          images: string[];
          contents: string;
          likes: string[];
          emojies: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          images?: string[];
          contents: string;
          likes?: string[];
          emojies?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          images?: string[];
          contents?: string;
          likes?: string[];
          emojies?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          feed_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          feed_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          feed_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Extended types for API responses
export interface FeedWithUser {
  id: string;
  user_id: string;
  images: string[];
  contents: string;
  likes: string[];
  emojies: string[];
  created_at: string;
  updated_at: string;
  user: Database['public']['Tables']['users']['Row'];
  comments_count: number;
  likes_count: number;
}

export interface CommentWithUser {
  id: string;
  feed_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: Database['public']['Tables']['users']['Row'];
}

// API Request/Response types
export interface CreateFeedRequest {
  contents: string;
  images?: string[];
  emojies?: string[];
}

export interface UpdateFeedRequest {
  contents?: string;
  images?: string[];
  emojies?: string[];
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface LikeFeedRequest {
  feedId: string;
}

export interface UnlikeFeedRequest {
  feedId: string;
} 