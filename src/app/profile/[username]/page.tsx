'use client';

import { useState, useEffect } from 'react';
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { WithBottomMenu } from "@/components/hoc/withBottomMenu"
import { getUserByUsername, getUserFeedsCount } from "@/lib/api/users"
import { ProfileLoading } from "@/components/ui/ProfileLoading"
import { useRouter } from 'next/navigation';
import { Database } from '@/types/feed';

type User = Database['public']['Tables']['users']['Row'];

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [feedsCount, setFeedsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user by username
        const userData = await getUserByUsername(params.username);
        
        if (!userData) {
          setError('사용자를 찾을 수 없습니다');
          return;
        }

        setUser(userData);

        // Get user's feeds count
        const count = await getUserFeedsCount(userData.id);
        setFeedsCount(count);

      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('프로필을 불러오는 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    if (params.username) {
      fetchUserProfile();
    }
  }, [params.username]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <WithBottomMenu>
        <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
          <ProfileLoading />
        </div>
      </WithBottomMenu>
    );
  }

  if (error) {
    return (
      <WithBottomMenu>
        <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={handleBack}
              className="text-orange-500 hover:text-orange-600"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </WithBottomMenu>
    );
  }

  if (!user) {
    return (
      <WithBottomMenu>
        <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">사용자를 찾을 수 없습니다</p>
            <button 
              onClick={handleBack}
              className="text-orange-500 hover:text-orange-600"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </WithBottomMenu>
    );
  }

  return (
    <WithBottomMenu>
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
          <div className="w-5 h-5"></div> {/* Spacer for centering */}
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center p-6">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full bg-orange-100 mb-4 overflow-hidden">
            <Image
              src={user.avatar_url || "/placeholder.svg?height=128&width=128"}
              alt="Profile picture"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Username */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            @{user.username}
          </h2>

          {/* Stats */}
          <div className="flex w-full justify-between mb-6">
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-gray-900">{feedsCount}</span>
              <span className="text-gray-500 text-sm">Posts</span>
            </div>
            <div className="flex flex-col items-center flex-1 border-x border-gray-200">
              <span className="text-2xl font-bold text-gray-900">0</span>
              <span className="text-gray-500 text-sm">Followers</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-gray-900">0</span>
              <span className="text-gray-500 text-sm">Following</span>
            </div>
          </div>

          {/* Description */}
          {user.description && (
            <p className="text-center text-gray-700 leading-relaxed mb-6">
              {user.description}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button className="flex-1 py-3 text-center font-medium text-gray-900 border-b-2 border-gray-900">Posts</button>
          <button className="flex-1 py-3 text-center font-medium text-gray-500">Saved</button>
          <button className="flex-1 py-3 text-center font-medium text-gray-500">Liked</button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-1 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={`/placeholder.svg?height=200&width=200`}
                alt={`Gecko photo ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </WithBottomMenu>
  );
} 