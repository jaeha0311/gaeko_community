export interface Comment {
  id: string;
  feedId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[]; // Array of user IDs
}
