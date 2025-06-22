'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Generate unique username
  const generateUniqueUsername = (baseName: string) => {
    const timestamp = Date.now().toString().slice(-4);
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseName}_${timestamp}_${randomSuffix}`;
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          return;
        }

        if (data.session) {
          // 사용자 프로필 생성 또는 업데이트
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // 사용자 프로필이 있는지 확인
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single();

            if (!existingUser) {
              // Generate unique username
              const baseName = user.email?.split('@')[0] || 'user';
              let username = generateUniqueUsername(baseName);
              
              // Try to insert with generated username, retry if duplicate
              let insertError;
              let retryCount = 0;
              const maxRetries = 5;
              
              do {
                insertError = null;
                const { error } = await supabase
                  .from('users')
                  .insert({
                    id: user.id,
                    email: user.email!,
                    username: username,
                    avatar_url: user.user_metadata?.avatar_url,
                  });

                if (error) {
                  if (error.code === '23505' && error.message.includes('username')) {
                    // Username already exists, generate new one
                    username = generateUniqueUsername(baseName);
                    retryCount++;
                  } else {
                    insertError = error;
                  }
                }
              } while (insertError && retryCount < maxRetries);

              if (insertError) {
                console.error('Error creating user profile:', insertError);
              }
            }
          }

          // 메인 페이지로 리다이렉션
          router.push('/');
        } else {
          // 세션이 없으면 로그인 페이지로
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth callback failed:', err);
        setError('인증 처리 중 문제가 발생했어요');
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-4xl mb-4">😅</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            로그인 중 문제가 발생했어요
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🦎</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          게코랜드에 로그인하는 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요!</p>
      </div>
    </div>
  );
} 