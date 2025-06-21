# Supabase 쿠키 도메인 문제 해결 가이드

## 🔍 문제 원인

Set-Cookie 헤더의 도메인과 현재 도메인이 일치하지 않아서 발생하는 문제입니다.

## 🛠️ 해결 방법

### 1. 환경 변수 확인

`.env.local` 파일에서 Supabase URL이 올바른지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Supabase 설정 확인

Supabase 대시보드에서:

1. **Authentication** → **URL Configuration**
2. **Site URL**을 `http://localhost:3000`으로 설정
3. **Redirect URLs**에 다음 추가:

   ```
   http://localhost:3000/auth/callback
   ```

### 3. 브라우저 캐시 및 쿠키 삭제

1. 브라우저 개발자 도구 열기 (F12)
2. **Application** 탭 → **Storage** → **Clear storage**
3. **Cookies** 삭제
4. 페이지 새로고침

### 4. 개발 서버 재시작

```bash
npm run dev
```

## 🔧 추가 해결책

### 임시 해결책: 익명 로그인 사용

Google OAuth 설정이 완료될 때까지 익명 로그인을 사용할 수 있습니다:

1. Supabase 대시보드 → **Authentication** → **Providers**
2. **Anonymous** 제공자를 **Enable**로 설정
3. 테스트 페이지에서 "익명으로 로그인" 버튼 사용

### 쿠키 설정 최적화

코드에서 이미 쿠키 설정을 최적화했습니다:

- `domain` 설정 제거
- `httpOnly: true` 설정
- `sameSite: 'lax'` 설정
- `path: '/'` 설정

## 🚀 테스트 방법

1. 브라우저 개발자 도구 → **Network** 탭 열기
2. 로그인 시도
3. **auth/v1/callback** 요청 확인
4. **Response Headers**에서 **Set-Cookie** 확인

## 📝 주의사항

- 개발 환경에서는 `http://localhost:3000` 사용
- 프로덕션에서는 `https://your-domain.com` 사용
- 쿠키는 현재 도메인에서만 설정됨
- 브라우저 보안 정책으로 인해 도메인 불일치 시 쿠키 설정 실패

## 🔍 디버깅

문제가 지속되면:

1. 브라우저 개발자 도구 → **Console** 탭에서 에러 확인
2. **Network** 탭에서 요청/응답 헤더 확인
3. Supabase 대시보드 → **Logs**에서 서버 로그 확인
