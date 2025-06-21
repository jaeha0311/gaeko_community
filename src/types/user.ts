export interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  tag: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
} 