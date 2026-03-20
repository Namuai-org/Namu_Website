# Deploy Namu website on Vercel

This app is **Next.js 15** (`namu-website`). Vercel runs `next build` and hosts the result.

## Build stuck or fails at "Collecting build traces"

If **`outputFileTracingRoot`** is set to the **repo root** while Vercel’s **Root Directory** is `namu-website`, Next can try to trace **sibling folders** (other apps, `node_modules`), which can **slow, hang, or fail** the build. Keep the default tracing (app folder only) unless you use a **hoisted** monorepo install (e.g. npm workspaces at repo root).

## 404 after deploy

**Cause:** The Git repo root is **`Namu-/`**, but the Next.js app is inside **`namu-website/`**. If **Root Directory** is not set to `namu-website`, Vercel builds the wrong folder (or nothing useful) and the site can return **404**.

**Fix:**

1. Vercel → **Project** → **Settings** → **General**
2. **Root Directory** → **Edit** → enter **`namu-website`**
3. **Save**
4. **Deployments** → **Redeploy** the latest deployment

Framework should remain **Next.js**. Install / build commands can stay default (`npm install`, `npm run build`) — they run *inside* `namu-website` once the root directory is set.

## 1. Push code to GitHub (or GitLab / Bitbucket)

Vercel deploys from a Git repo. Commit and push your project.

## 2. Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. **Add New… → Project** → import your repository.

### If the repo root is the monorepo (e.g. `Namu-/` with `namu-website/` inside)

- **Root Directory:** set to `namu-website` (Framework Preset should stay **Next.js**).
- Install command: `npm install` (default).
- Build command: `npm run build` (default).
- Output: leave default (Next.js handles it).

### If only `namu-website` is the repo root

- No root directory override needed.

## 3. Environment variables

In the project: **Settings → Environment Variables**, add (if you use Supabase for login / studio):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Use **Production**, **Preview**, and **Development** as needed. Redeploy after saving.

Without these, the marketing site still works; **Open Studio** will send users to `/login` (see `lib/supabaseClient.ts`).

## 4. Deploy

Click **Deploy**. Every push to the connected branch triggers a new deployment (unless you change Git settings).

## 5. Custom domain (optional)

**Settings → Domains** → add your domain and follow DNS instructions.

## Local check before deploy

```bash
cd namu-website
npm install
npm run build
```

If `npm run build` passes locally, Vercel should build successfully with the same settings.
