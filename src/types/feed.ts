export interface FeedItem {
  id: string;
  userId: string;
  images: string[];
  contents: string;
  likes: string[]; // Array of user IDs
  comments: string[]; // Array of comment IDs
  emojies: string[];
  createdAt: string; // ISO 8601 format
} 