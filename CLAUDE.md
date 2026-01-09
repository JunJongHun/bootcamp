# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 프로젝트 개요

bootcamp-todo는 Next.js 15와 shadcnui를 사용한 실시간 투두 웹 애플리케이션입니다. Supabase를 백엔드로 사용하여 데이터를 실시간으로 동기화합니다.

**기술 스택**:
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: shadcnui, Tailwind CSS, Lucide React Icons
- **상태 관리**: React Hooks + Supabase Realtime
- **백엔드**: Supabase (PostgreSQL, Auth, Realtime)
- **배포**: Vercel (Next.js 추천)

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본: http://localhost:3000, 포트 충돌시 3001)
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 실행
npm run lint

# TypeScript 타입 체크
npx tsc --noEmit
```

## 아키텍처 개요

### 데이터 흐름
```
User Input (TodoApp.tsx)
  ↓
useTodos Hook
  ↓
Supabase Client (lib/supabase.ts)
  ↓
PostgreSQL Database
  ↓
Realtime Subscription (via postgres_changes)
  ↓
자동 UI 갱신
```

### 주요 구성 요소

**1. TodoApp 컴포넌트** (`components/TodoApp.tsx`)
- 메인 UI 컴포넌트
- 투도 리스트 렌더링, 입력 폼, 삭제 버튼 관리
- `useTodos` 훅으로 상태 관리

**2. useTodos 훅** (`hooks/useTodos.ts`)
- Supabase와의 모든 CRUD 작업 관리
- 실시간 데이터 동기화 (PostgreSQL Changes)
- 로딩 상태 (`isLoading`, `isLoaded`) 추적
- 함수: `loadTodos`, `addTodo`, `deleteTodo`, `toggleTodo`, `updateTodo`, `clearCompleted`

**3. Supabase 설정** (`lib/supabase.ts`)
- Supabase 클라이언트 초기화
- 환경 변수를 통한 URL과 API 키 주입

**4. 데이터 모델** (`types/todo.ts`)
```typescript
interface Todo {
  id: string;              // UUID
  title: string;           // 작업 제목
  completed: boolean;      // 완료 여부
  createdAt: Date;         // 생성 시간
  dueDate?: Date;          // 기한 (선택)
  category?: string;       // 카테고리 (선택)
  priority?: 'low' | 'medium' | 'high'; // 우선순위 (선택)
}
```

### 데이터베이스 스키마

**todos 테이블**:
- `id` (UUID, PK): 자동 생성
- `title` (TEXT, NOT NULL): 작업 제목
- `completed` (BOOLEAN, DEFAULT false): 완료 상태
- `priority` (TEXT, CHECK in ['low', 'medium', 'high'], DEFAULT 'medium')
- `category` (TEXT, NULLABLE)
- `due_date` (TIMESTAMP WITH TIME ZONE, NULLABLE)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

**인덱스**:
- `idx_todos_created_at`: 조회 성능 최적화
- `idx_todos_completed`: 필터링 성능 최적화

**RLS 정책** (현재 개발용 - 프로덕션에서는 인증 기반으로 변경):
- SELECT: 모두 허용
- INSERT: 모두 허용
- UPDATE: 모두 허용
- DELETE: 모두 허용

## 환경 변수

`.env.local` 필수 변수:
```env
NEXT_PUBLIC_SUPABASE_URL=https://dhggoxehzurqucvwmero.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

## UI 디자인 특징

- **색상 주제**: 보라색 그래디언트 (primary: purple-500 ~ purple-600)
- **배경**: 라이트 보라색 (purple-100)
- **카드**: 하얀색 배경, 둥근 모서리 (rounded-xl)
- **버튼**: 그래디언트 보라색, 둥근 전체 (rounded-full)
- **반응형**: 모바일 친화적 (px-4 py-8)

## 개발 팁

### Supabase 실시간 동기화 이해하기
- `hooks/useTodos.ts`의 `subscribeToTodos()` 함수가 postgres_changes 채널 구독
- 데이터베이스 변경 시 자동으로 `loadTodos()` 호출하여 UI 갱신
- 여러 탭/기기에서 동시 작업 시에도 실시간 반영

### 새로운 기능 추가 시
1. Database 스키마 확장 (필요시 migration)
2. `types/todo.ts`의 Todo 인터페이스 업데이트
3. `hooks/useTodos.ts`에 새로운 함수 추가
4. `components/TodoApp.tsx`에 UI 컴포넌트 추가
5. Supabase RLS 정책 검토

### 프로덕션 체크리스트
- [ ] RLS 정책을 인증 기반으로 변경 (Row-Level Security)
- [ ] Supabase 백업 설정
- [ ] 에러 로깅 시스템 구축
- [ ] 성능 모니터링 추가
- [ ] 사용자 인증 구현
- [ ] HTTPS 사용 확인
