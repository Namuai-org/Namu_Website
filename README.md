# Namu

This repository contains multiple projects. The public **marketing website** is a Next.js app in **`namu-website/`**.

## Deploy on Vercel (fix 404)

If your deployment shows **404 Not Found**, Vercel is almost certainly building from the **wrong folder**.

1. Open your project on [Vercel](https://vercel.com) → **Settings** → **General**.
2. Find **Root Directory** → **Edit**.
3. Set it to: **`namu-website`**
4. Click **Save**.
5. Go to **Deployments** → open the latest deployment → **⋯** → **Redeploy** (use the same Git commit).

Do **not** leave Root Directory empty or `.` unless your Next.js app files (`package.json`, `next.config.mjs`, `app/`) are at the repository root.

More detail: [`namu-website/docs/VERCEL.md`](namu-website/docs/VERCEL.md).
