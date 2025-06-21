import { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile, getUserFeedsCount } from '@/lib/api/users';
import { Database } from '@/types/feed';

type User = Database['public']['Tables']['users']['Row'];

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [feedsCount, setFeedsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
      
      if (userData) {
        const count = await getUserFeedsCount(userData.id);
        setFeedsCount(count);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Database['public']['Tables']['users']['Update']>) => {
    try {
      setError(null);
      const updatedUser = await updateUserProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    feedsCount,
    loading,
    error,
    refetch: fetchUser,
    updateProfile,
  };
}; 