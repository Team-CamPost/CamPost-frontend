# CamPost Frontend

CamPost Frontend 저장소의 개발 워크플로우와 협업 규칙을 정리한 문서
팀원 누구나 동일한 기준으로 이슈 발행, 브랜치 작업, PR 리뷰를 진행할 수 있도록 작성했습니다.

## 1. 개발 전 작업

### 1-1. Issue 발행

- 이슈 하나(브랜치 하나)에서는 하나의 기능만 개발합니다.
- 이슈 제목 규칙:
  - [이슈종류] 이슈 제목
  - 예시: [Feat] example API 구현, [Fix] dev 브랜치 충돌 해결
- 이슈 템플릿:
  - .github/ISSUE_TEMPLATE/feature_request.md
- 이슈 작성 시 필수:
  - Assignees 지정
  - Labels 지정
  - 작업 체크리스트 작성

### 1-2. 로컬 최신화

개발 시작 전 반드시 최신 변경 사항을 반영합니다.

```bash
git fetch
git pull
```

## 2. 브랜치 전략

### 2-1. Git Flow 기반 운영

- dev 브랜치: default 브랜치, 개발 통합용
- 기능 브랜치: dev에서 분기 후 dev로 병합

### 2-2. 브랜치 네이밍 규칙

- 규칙: 타입/이슈번호-기능명
- 예시:
  - feat/12-init-project
  - fix/3-add-login
  - refactor/22-cart-page
  - docs/17-readme

사용 타입:

| 타입     | 설명          |
| -------- | ------------- |
| chore    | 프로젝트 설정 |
| docs     | 문서 수정     |
| feat     | 기능 개발     |
| fix      | 버그 수정     |
| refactor | 구조 개선     |
| style    | 스타일 수정   |

## 3. 개발 후 Commit & Push

### 3-1. 포맷/린트 규칙

- 커밋 전 포맷팅 권장:

```bash
pnpm run format
```

- Prettier 설정 파일:
  - .prettierrc
- pre-commit 훅:
  - .husky/pre-commit
  - pnpm exec lint-staged 실행
  - staged 파일만 eslint --fix / prettier --write 자동 적용

### 3-2. 커밋 메시지 규칙

- 규칙: 타입: 커밋 설명 (#이슈번호)
- 예시:

```bash
git commit -m "feat: 로그인 구현 (#9)"
git commit -m "fix: 카드 페이지 수정 (#10)"
git commit -m "refactor: 아이콘 리팩토링 (#13)"
```

- 커밋 Body에는 변경 이유/핵심 구현 내용을 상세히 작성합니다.
- dev 브랜치 직접 push는 금지합니다.

## 4. PR 생성 및 Merge

### 4-1. PR 제목/본문 규칙

- PR 제목 규칙: 타입(#이슈번호): 핵심 PR 내용
- 예시:
  - Feat(#9): 로그인 구현
  - Fix(#10): 카드 페이지 수정
  - Refactor(#13): 아이콘 리팩토링
- PR 템플릿:
  - .github/pull_request_template.md

### 4-2. 리뷰 및 머지 규칙

- PR 작성 후 Reviewer, Assignee, Label을 지정합니다.
- 테스트 결과(스크린샷 포함)를 PR에 첨부합니다.
- dev 브랜치 머지는 1명 이상의 Approve 이후 진행합니다.

## 5. 표준 개발 워크플로우

아래 순서로 팀 협업을 진행합니다.

1. Issue 발행
2. 브랜치 생성 (타입/이슈번호-기능명)
3. 기능 개발 및 테스트
4. Commit & Push
5. PR 생성 (템플릿 작성 + 스크린샷 첨부)
6. 코드 리뷰 반영
7. Approve 후 dev 머지

## 6. 프로젝트 폴더 구조

아래는 frontend 저장소의 핵심 구조입니다.

```text
CamPost-frontend/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  └─ feature_request.md
│  └─ pull_request_template.md
├─ .husky/
│  └─ pre-commit
├─ public/
├─ src/
│  ├─ app/            # 라우터, 레이아웃, 전역 provider
│  ├─ assets/         # 정적 리소스
│  ├─ features/       # 도메인별 기능 컴포넌트
│  ├─ pages/          # 페이지 단위 화면
│  ├─ shared/         # 공통 API, 타입, 유틸
│  ├─ main.tsx
│  ├─ App.tsx
│  └─ index.css
├─ .prettierrc
├─ eslint.config.js
├─ package.json
├─ vite.config.ts
└─ README.md
```

## 7. 실행 명령어

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run format
pnpm run build
```

## 8. 협업 원칙 요약

- 작은 단위 이슈/브랜치/PR로 나눠 작업합니다.
- 규칙 기반 네이밍과 템플릿으로 커뮤니케이션 비용을 줄입니다.
- 코드 품질(린트/포맷/리뷰)과 재현 가능한 결과(테스트 스크린샷)를 함께 관리합니다.
