import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/feed';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Supabase에서 받은 쿠키의 도메인을 제거하여 현재 도메인에서만 작동하도록 함
              const restOptions = options ? { ...options } : {};
              delete restOptions.domain;
              cookieStore.set(name, value, {
                ...restOptions,
                httpOnly: true,
                secure: false, // 개발 환경에서는 false
                sameSite: 'lax',
                path: '/',
              });
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
} 