# MangaDB

만화 정보 및 리뷰를 관리하는 웹 애플리케이션.  
**Next.js + NeonDB(PostgreSQL) + Netlify** 스택으로 구성되어 있습니다.

---

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 스타일 | Tailwind CSS + shadcn/ui |
| 애니메이션 | Framer Motion |
| 데이터베이스 | NeonDB (PostgreSQL, serverless) |
| 이미지 호스팅 | Cloudinary |
| 배포 | Netlify (`@netlify/plugin-nextjs`) |

---

## 프로젝트 구조

```
manga-db/
├── app/
│   ├── api/manga/route.ts     ← GET API (검색·정렬 쿼리)
│   ├── page.tsx               ← 메인 페이지 (SPA, debounce 검색)
│   ├── layout.tsx             ← dark 클래스 기본 적용
│   └── globals.css            ← 다크/라이트 CSS 변수 정의
├── components/
│   ├── MangaCard.tsx          ← 와이드 바 카드 (Framer Motion 애니메이션)
│   ├── MangaList.tsx          ← 리스트 컨테이너 + AnimatePresence
│   ├── SearchBar.tsx          ← 검색 입력 (X 버튼 포함)
│   └── FilterControls.tsx     ← searchBy / sortBy / sortOrder 셀렉터
├── lib/
│   ├── db.ts                  ← NeonDB Pool (지연 초기화)
│   ├── types.ts               ← Manga, FilterParams TypeScript 타입
│   └── schema.sql             ← DB 초기화 SQL + 샘플 데이터 3건
├── .env.example               ← 환경변수 템플릿 → .env.local 로 복사 후 값 입력
└── netlify.toml               ← Netlify 빌드 설정
```

---

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해서 `.env.local`을 생성하고 값을 채웁니다.

```bash
cp .env.example .env.local
```

`.env.local` 필수 값:

```env
# NeonDB 연결 문자열
# https://console.neon.tech → 프로젝트 → Connection Details
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Cloudinary (이미지 업로드 시 필요)
# https://console.cloudinary.com → Settings → API Keys
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. 데이터베이스 초기화

[NeonDB 콘솔](https://console.neon.tech) → SQL Editor에서 `lib/schema.sql` 내용을 실행합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인.

---

## 데이터베이스 스키마

```sql
CREATE TABLE manga (
  id       SERIAL PRIMARY KEY,
  name     TEXT NOT NULL,
  alias    TEXT[]       DEFAULT '{}',     -- 별명 목록
  author   TEXT[]       DEFAULT '{}',     -- 작가 목록
  rate     NUMERIC(3,1) DEFAULT 0.0,      -- 0.0 ~ 10.0
  image    TEXT         DEFAULT '',       -- Cloudinary URL (표지)
  icon     TEXT         DEFAULT '',       -- Cloudinary URL (아이콘)
  summary  TEXT         DEFAULT '',
  review   TEXT         DEFAULT '',
  genre    TEXT[]       DEFAULT '{}',     -- 장르 목록
  state    TEXT         DEFAULT 'ongoing', -- ongoing / completed / hiatus
  updated  TIMESTAMPTZ  DEFAULT NOW(),
  created  TIMESTAMPTZ  DEFAULT NOW()
);
```

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 검색 필터 | 제목/별명, 작가, 장르 중 선택 후 키워드 검색 (ILIKE) |
| 정렬 | 최근 업데이트 / 등록일 / 평점 / 제목 + 오름차순·내림차순 |
| 디바운스 | 350ms 지연으로 불필요한 API 요청 최소화 |
| 애니메이션 | Framer Motion — 카드 등장, 평점 바, 리스트 전환 |
| 다크 모드 | `html.dark` 기본값, CSS 변수로 라이트 모드도 준비됨 |
| 상태 표시 | 연재중(초록) / 완결(파랑) / 휴재(주황) 색상 구분 |

---

## API

### `GET /api/manga`

manga 목록을 반환합니다.

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `query` | string | `""` | 검색 키워드 |
| `searchBy` | `name` \| `author` \| `genre` | `name` | 검색 대상 필드 |
| `sortBy` | `updated` \| `created` \| `rate` \| `name` | `updated` | 정렬 기준 |
| `sortOrder` | `asc` \| `desc` | `desc` | 정렬 방향 |

**응답 예시:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Berserk",
      "alias": ["베르세르크"],
      "author": ["Kentaro Miura"],
      "rate": 9.8,
      "image": "https://res.cloudinary.com/...",
      "icon": "https://res.cloudinary.com/...",
      "summary": "...",
      "review": "...",
      "genre": ["Action", "Dark Fantasy"],
      "state": "hiatus",
      "updated": "2026-05-19T00:00:00Z",
      "created": "1996-01-01T00:00:00Z"
    }
  ]
}
```

---

## Netlify 배포

1. [NeonDB](https://console.neon.tech) — 프로젝트 생성 후 `DATABASE_URL` 확보
2. GitHub 레포지토리와 Netlify 연결
3. Netlify 대시보드 → **Site settings → Environment variables** 에 값 입력
4. Deploy — `netlify.toml`이 자동으로 빌드 명령과 플러그인을 적용

---

## 향후 계획

- [ ] manga 상세 페이지 (`/manga/[id]`)
- [ ] manga 추가 / 수정 / 삭제 관리자 UI
- [ ] Cloudinary 이미지 업로드 연동
- [ ] 라이트/다크 모드 토글 버튼
- [ ] 장르별 서브 페이지
