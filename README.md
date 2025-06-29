# Geckoland - Feed Application

Next.js와 Supabase를 사용한 소셜 피드 애플리케이션입니다.

모든 디자인과 개발은 AI를 이용해서 진행해 보았습니다.

- 디자인 시나리오: [퍼플렉시티](https://www.perplexity.ai/)
- 디자인: [Stitch](http://stitch.withgoogle.com/)
- UI 컴포넌트 개발: [v0](https://v0.dev/)
- 로직 개발: Cursor + Figma MCP

## 🚀 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## 📋 데이터베이스 스키마

### 테이블 구조

#### 1. users 테이블

```sql
- id (UUID, Primary Key) - Supabase Auth와 연결
- email (TEXT, Unique)
- username (TEXT, Unique)
- full_name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. feeds 테이블

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key) - users.id 참조
- images (TEXT[]) - 이미지 URL 배열
- contents (TEXT) - 피드 내용
- likes (UUID[]) - 좋아요한 사용자 ID 배열
- emojies (TEXT[]) - 이모지 배열
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. comments 테이블

```sql
- id (UUID, Primary Key)
- feed_id (UUID, Foreign Key) - feeds.id 참조
- user_id (UUID, Foreign Key) - users.id 참조
- content (TEXT) - 댓글 내용
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🛠️ 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Kakao Maps API (선택사항)
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_javascript_key_here
```

### 3. 카카오 지도 API 설정 (선택사항)

카카오 지도 기능을 사용하려면:

1. [카카오 개발자 센터](https://developers.kakao.com/)에서 Maps API 키 발급
2. `KAKAO_MAPS_SETUP.md` 파일 참조하여 상세 설정
3. 환경변수에 API 키 추가

### 4. Supabase 데이터베이스 설정

1. Supabase 프로젝트를 생성하세요
2. SQL Editor에서 `supabase-schema.sql` 파일의 내용을 실행하세요
3. Row Level Security (RLS)가 자동으로 설정됩니다

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   └── FeedList.tsx       # 피드 목록 컴포넌트
├── hooks/                  # Custom Hooks
│   ├── useFeeds.ts        # 피드 관련 TanStack Query hooks
│   └── useComments.ts     # 댓글 관련 TanStack Query hooks
├── lib/                    # 유틸리티 및 설정
│   ├── api/               # API 함수들
│   │   ├── feeds.ts       # 피드 API
│   │   └── comments.ts    # 댓글 API
│   ├── supabaseClient.ts  # Supabase 클라이언트
│   └── providers.tsx      # React Query Provider
└── types/                  # TypeScript 타입 정의
    └── feed.ts            # 피드 관련 타입들
```

## 🔧 API 사용법

### TanStack Query Hooks

#### 피드 관련

```typescript
import { useFeeds, useCreateFeed, useLikeFeed } from '@/hooks/useFeeds';

// 모든 피드 가져오기
const { data: feeds, isLoading } = useFeeds();

// 특정 피드 가져오기
const { data: feed } = useFeed(feedId);

// 사용자별 피드 가져오기
const { data: userFeeds } = useUserFeeds(userId);

// 피드 생성
const createFeedMutation = useCreateFeed();
createFeedMutation.mutate({ contents: 'Hello World!' });

// 좋아요/좋아요 취소
const likeMutation = useLikeFeed();
const unlikeMutation = useUnlikeFeed();
likeMutation.mutate(feedId);
unlikeMutation.mutate(feedId);
```

#### 댓글 관련

```typescript
import { useComments, useCreateComment } from '@/hooks/useComments';

// 피드의 댓글 가져오기
const { data: comments } = useComments(feedId);

// 댓글 생성
const createCommentMutation = useCreateComment();
createCommentMutation.mutate({ 
  feedId, 
  data: { content: 'Great post!' } 
});
```

## 🔒 보안

- Row Level Security (RLS)가 모든 테이블에 적용되어 있습니다
- 사용자는 자신의 데이터만 수정/삭제할 수 있습니다
- 인증되지 않은 사용자는 읽기만 가능합니다

## 🚀 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📝 주요 기능

- ✅ 피드 CRUD 작업
- ✅ 댓글 시스템
- ✅ 좋아요 기능
- ✅ 이미지 업로드 지원
- ✅ 사용자 프로필 관리
- ✅ 위치 기반 서비스 (카카오 지도)
- ✅ 실시간 캐싱 (TanStack Query)
- ✅ 타입 안전성 (TypeScript)
- ✅ 반응형 디자인 (Tailwind CSS)

## 🔄 캐싱 전략

TanStack Query를 사용하여 다음과 같은 캐싱 전략을 구현했습니다:

- **피드 목록**: 5분 stale time, 10분 garbage collection
- **개별 피드**: 5분 stale time, 10분 garbage collection  
- **댓글**: 2분 stale time, 5분 garbage collection
- **Optimistic Updates**: 좋아요/좋아요 취소 시 즉시 UI 업데이트
- **Background Refetching**: 데이터 변경 시 자동으로 관련 쿼리 무효화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
