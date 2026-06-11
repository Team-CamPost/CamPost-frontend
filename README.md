# CamPost Frontend

대학교 학과 공지를 수집·가공·제공하는 **CamPost** 서비스의 프론트엔드(SPA) 저장소입니다.
공지 대시보드, 검색·필터, 공지 상세·첨부 미리보기, 로그인·북마크·마이페이지 등 사용자 화면을 담당합니다.

> **기본 브랜치는 `dev`입니다.** 모든 작업은 `dev`에서 분기하고 `dev`로 병합합니다. `dev` 직접 push는 금지입니다.

> **CamPost는 3개 저장소로 구성됩니다.**
>
> | 저장소               | 역할                          | 스택                |
> | -------------------- | ----------------------------- | ------------------- |
> | **CamPost-frontend** | 사용자 화면 (현재 저장소)     | React · Vite        |
> | **CamPost-backend**  | REST API · 인증 · 데이터 적재 | Spring Boot · Java  |
> | **CamPost-pipeline** | 공지 크롤링 · 가공            | Python · Playwright |
>
> 프론트엔드는 `VITE_API_BASE_URL`로 백엔드 REST API와 통신합니다.

---

## 1. 기술 스택

| 구분            | 사용 기술                               |
| --------------- | --------------------------------------- |
| 언어/프레임워크 | React 19 · TypeScript                   |
| 빌드 도구       | Vite                                    |
| 스타일          | TailwindCSS 4                           |
| 서버 상태       | TanStack Query (React Query)            |
| 라우팅          | React Router 7                          |
| HTTP 클라이언트 | Axios (JWT 인터셉터 + 토큰 자동 재발급) |
| 패키지 매니저   | pnpm                                    |
| 품질 도구       | ESLint · Prettier · Husky (pre-commit)  |
| 배포            | Vercel (GitHub Actions 자동 배포)       |

---

## 2. 시작하기 (신규 팀원용)

### 2-1. 사전 준비

- Node.js 20 이상
- pnpm (`npm install -g pnpm`)

### 2-2. 설치 및 실행

```bash
# 1. 저장소 클론 후 dev 브랜치로 이동
git clone <repo-url>
cd CamPost-frontend
git switch dev

# 2. 의존성 설치 (husky pre-commit 훅도 자동 설치됨)
pnpm install

# 3. 환경 변수 설정
cp .env.example .env.local
#   .env.local 의 VITE_API_BASE_URL 을 백엔드 주소로 설정
#   - 로컬 백엔드:  http://localhost:8080
#   - 배포 백엔드:  https://<배포된-백엔드-주소>

# 4. 개발 서버 실행 (http://localhost:5173)
pnpm run dev
```

### 2-3. 환경 변수

| 변수                | 설명                  | 예시                    |
| ------------------- | --------------------- | ----------------------- |
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL | `http://localhost:8080` |

> 배포(Vercel) 환경 변수는 GitHub Actions Secret(`VITE_API_BASE_URL`)으로 주입됩니다.

---

## 3. 프로젝트 구조

```text
CamPost-frontend/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  └─ feature_request.md      # 이슈 템플릿
│  ├─ workflows/
│  │  ├─ ci.yml                  # CI: lint · format · build (PR/푸시)
│  │  └─ deploy.yml              # CD: Vercel 자동 배포 (dev 푸시)
│  └─ pull_request_template.md   # PR 템플릿
├─ .husky/
│  └─ pre-commit                 # 커밋 전 lint-staged 실행
├─ public/                       # 정적 파일 (favicon 등)
├─ src/
│  ├─ app/                       # 앱 전역 구성
│  │  ├─ layouts/                #   레이아웃 (RootLayout, DepartmentLayout 등)
│  │  ├─ providers/              #   전역 Provider (QueryProvider 등)
│  │  └─ router/                 #   라우터 정의 · 경로 상수 · 라우트 가드
│  ├─ assets/                    # 이미지 등 정적 리소스
│  ├─ features/                  # 도메인별 기능 컴포넌트
│  │  ├─ crawl/                  #   크롤 현황 관련 타입/모델
│  │  ├─ dashboard/              #   대시보드 (공지 카드·섹션·필터·검색)
│  │  └─ noticeDetail/           #   공지 상세 (본문·사이드바·첨부)
│  ├─ pages/                     # 페이지 단위 화면 (라우트와 1:1)
│  │  ├─ bookmarks/              #   북마크한 공지
│  │  ├─ dashboard/              #   학과 대시보드
│  │  ├─ login/  signup/         #   로그인 · 회원가입
│  │  ├─ mypage/                 #   마이페이지 (프로필·설정 모달)
│  │  ├─ noticeDetail/           #   공지 상세 페이지
│  │  ├─ onboarding/             #   온보딩 (학과/학년 설정)
│  │  ├─ recent/                 #   최근 본 공지
│  │  └─ notFound/               #   404
│  ├─ shared/                    # 공통 모듈
│  │  ├─ api/                    #   API 클라이언트·도메인별 호출 함수
│  │  ├─ components/             #   공통 컴포넌트 (로그인 필요 모달 등)
│  │  ├─ config/                 #   환경 설정 (env)
│  │  ├─ constants/              #   상수 (학과 목록 등)
│  │  ├─ hooks/                  #   커스텀 훅 (useAuth, useEscapeKey 등)
│  │  ├─ types/                  #   공통 타입
│  │  └─ utils/                  #   유틸 (날짜·자산 URL 등)
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env.example
├─ .prettierrc
├─ eslint.config.js
├─ package.json
├─ vite.config.ts
└─ README.md
```

---

## 4. 협업 워크플로우

> 모든 변경은 **이슈 → 브랜치 → 커밋 → PR → 리뷰 → `dev` 머지**의 흐름을 따릅니다.

### 4-1. 브랜치 전략

- **`dev` = 기본(default) 브랜치**, 개발 통합용 — **직접 push 금지**
- 기능 브랜치는 `dev`에서 분기 후 PR로 `dev`에 병합
- 머지 방식: **Merge commit** (PR 단위 이력·개별 커밋 보존)

```bash
git switch dev
git pull origin dev
git switch -c feat/12-notice-card   # 타입/이슈번호-기능명
```

### 4-2. 작업 순서 (Step by Step)

1. **이슈 발행** — 하나의 이슈 = 하나의 기능. 템플릿(`.github/ISSUE_TEMPLATE`) 사용, Assignee·Label·체크리스트 작성
2. **로컬 최신화** — `git switch dev && git pull origin dev`
3. **브랜치 생성** — `타입/이슈번호-기능명`
4. **개발 & 커밋** — 컨벤션 준수 (pre-commit 훅이 lint/format 자동 적용)
5. **푸시 & PR 생성** — PR 템플릿 작성, `Closes #이슈번호` 연결
6. **CI 자동 검증** — lint · format · build 통과 확인
7. **코드 리뷰** — **1명 이상 Approve 필수**
8. **`dev` 머지** — 머지 시 Vercel 자동 배포

### 4-3. 네이밍 컨벤션

| 항목        | 규칙                         | 예시                         |
| ----------- | ---------------------------- | ---------------------------- |
| 브랜치      | `타입/이슈번호-기능명`       | `feat/79-mypage-features`    |
| 커밋 메시지 | `타입: 설명 (#이슈번호)`     | `feat: 북마크 토글 (#84)`    |
| PR 제목     | `타입(#이슈번호): 핵심 내용` | `Fix(#83): 북마크 즉시 반영` |

**사용 타입**: `feat`(기능) · `fix`(버그) · `refactor`(구조 개선) · `style`(스타일) · `chore`(설정) · `docs`(문서)

### 4-4. 코드 품질 (커밋 전 자동 검증)

- **pre-commit 훅(Husky)**: 커밋 시 `lint-staged`가 staged 파일에 ESLint `--fix` + Prettier 자동 적용
- 커밋 전 수동 검증: `pnpm run check` (lint + format 체크)
- ⚠️ pre-commit은 로컬 1차 방어선일 뿐, **최종 검증은 CI가 강제**합니다

---

## 5. CI/CD

### 5-1. CI — `.github/workflows/ci.yml`

PR 생성 및 `dev` 푸시 시 자동 실행되어 코드 품질을 검증합니다.

| 단계   | 명령                 |
| ------ | -------------------- |
| Lint   | `pnpm lint` (ESLint) |
| Format | `pnpm format:check`  |
| Build  | `pnpm build`         |

- GitHub Actions가 **머지 전 우회 불가능하게** 검증 (로컬 husky 우회 방지)
- 공급망 보안: 액션을 **커밋 SHA로 고정**, `persist-credentials: false`

### 5-2. CD — `.github/workflows/deploy.yml`

`dev` 브랜치에 머지(푸시)되면 **Vercel로 자동 배포**됩니다.

- Vercel CLI로 빌드·배포 (`VITE_API_BASE_URL` 등은 GitHub Secret으로 주입)
- 별도 수동 배포 불필요 — `dev` 머지 = 배포

---

## 6. 실행 명령어

```bash
pnpm install        # 의존성 설치 (+ husky 훅 설치)
pnpm run dev        # 개발 서버
pnpm run build      # 프로덕션 빌드 (tsc -b && vite build)
pnpm run lint       # ESLint
pnpm run format     # Prettier 자동 정리
pnpm run check      # lint + format 체크 (커밋 전 권장)
```

---

## 7. 협업 원칙 요약

- 작은 단위의 **이슈 / 브랜치 / PR**로 나눠 작업합니다.
- 규칙 기반 네이밍과 템플릿으로 커뮤니케이션 비용을 줄입니다.
- **`dev` 직접 push 금지** — 모든 변경은 PR + 1명 이상 리뷰를 거칩니다.
- 코드 품질(린트/포맷/CI)과 자동 배포(CD)로 일관성과 안정성을 유지합니다.
