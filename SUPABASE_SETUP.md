# Supabase Google OAuth 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 2.0 클라이언트 ID 생성

1. **APIs & Services** → **Credentials** 메뉴로 이동
2. **Create Credentials** → **OAuth 2.0 Client IDs** 클릭
3. **Application type**을 **Web application**으로 선택
4. **Authorized redirect URIs**에 다음 URL 추가:

   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

5. 클라이언트 ID와 클라이언트 시크릿을 복사

## 2. Supabase 설정

### 2.1 Authentication 설정

1. Supabase 대시보드에서 프로젝트로 이동
2. **Authentication** → **Providers** 메뉴로 이동
3. **Google** 제공자를 찾아 **Enable** 클릭
4. Google Cloud Console에서 복사한 정보 입력:
   - **Client ID**: Google OAuth 클라이언트 ID
   - **Client Secret**: Google OAuth 클라이언트 시크릿

### 2.2 Site URL 설정

1. **Authentication** → **URL Configuration** 메뉴로 이동
2. **Site URL**을 개발 환경에 맞게 설정:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-domain.com`

### 2.3 Redirect URLs 설정

**Redirect URLs**에 다음 URL들을 추가:

```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

## 3. 환경 변수 설정

`.env.local` 파일에 다음 변수들을 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. 테스트

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:3000` 접속
3. 자동으로 `/login` 페이지로 리다이렉션됨
4. "Sign in with Google" 버튼 클릭
5. Google 계정으로 로그인
6. 성공적으로 메인 페이지로 리다이렉션됨

## 5. 문제 해결

### 5.1 "redirect_uri_mismatch" 에러

- Google Cloud Console의 **Authorized redirect URIs**에 정확한 URL이 추가되었는지 확인
- Supabase의 **Redirect URLs**에도 동일한 URL이 추가되었는지 확인

### 5.2 "invalid_client" 에러

- Google Cloud Console의 클라이언트 ID와 시크릿이 정확히 입력되었는지 확인
- Supabase에서 Google 제공자가 활성화되었는지 확인

### 5.3 인증 후 사용자 정보가 저장되지 않는 경우

- Supabase SQL Editor에서 `handle_new_user` 함수가 정상적으로 생성되었는지 확인
- RLS 정책이 올바르게 설정되었는지 확인

## 6. 보안 고려사항

1. **환경 변수 보안**: `.env.local` 파일을 `.gitignore`에 추가
2. **프로덕션 설정**: 프로덕션 환경에서는 HTTPS URL 사용
3. **도메인 제한**: Google OAuth에서 허용된 도메인만 설정
4. **세션 관리**: 적절한 세션 만료 시간 설정
