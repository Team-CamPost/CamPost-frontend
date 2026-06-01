# Phase 1 Frontend Deploy

## Target

- Runtime: Vercel
- Branch: dev
- Issue: #65

## Vercel

- Framework preset: Vite
- Root directory: `CamPost-frontend`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: `dist`
- Auto deploy: `dev`

## Environment

```text
VITE_API_BASE_URL=https://<render-backend-domain>
```

## Checks

- Open Vercel URL
- Refresh nested routes
- Login/API request reaches Render backend
