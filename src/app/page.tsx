'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import Component from '@/components/pages/home';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 사용자 세션 체크
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    // 세션 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    checkUser();

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🦎</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            게코랜드에 로딩 중...
          </h2>
          <p className="text-gray-600">잠시만 기다려주세요!</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // 로그인 페이지로 리다이렉션 중
  }

  return (
    <Component />
  );
}
