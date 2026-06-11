# Deploying Portfolio Website on Hostinger Business Plan

Production host: **Hostinger Node.js Web Apps** (Business or Cloud).

The Express server serves static files from `public/` and handles `/health` and `/submit-audit`. Qwen AI and Airtable remain external services.

## Prerequisites

- Hostinger **Business Web Hosting** (or Cloud) with Node.js app support
- GitHub repo pushed (`Portfolio-website`)
- Airtable base with `Submissions` and `Error_Logs` tables configured
- Qwen API key from [DashScope](https://dashscope.aliyuncs.com/)

---

## GitHub auto-deploy (recommended)

### 1. Create Node.js app in hPanel

1. **Websites** → **Add Website** → **Node.js Web App**
2. Connect your GitHub account and select the `Portfolio-website` repository
3. Branch: `main`
4. Framework: **Express** (or Other / Node.js)

### 2. Build settings

| Setting | Value |
|---------|-------|
| Node version | **20.x** (LTS) |
| Install command | `npm ci` |
| Build command | *(leave empty — no build step required)* |
| Start command | `npm start` |
| Root directory | `/` (repo root) |

Hostinger sets `PORT` automatically. The server reads `process.env.PORT` first.

### 3. Environment variables

Set in hPanel → Node.js app → Environment:

```
QWEN_API_KEY=your-dashscope-key
AIRTABLE_API_KEY=your-airtable-token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
NODE_ENV=production
```

Never commit real keys. Copy from `.env.example`.

### 4. Domain and SSL

1. Assign your domain (e.g. `yourdomain.com`) to the Node.js app in hPanel
2. Enable SSL (automatic via Hostinger)
3. Add `www` → apex redirect if desired

### 5. DNS

Point your domain's A record (or nameservers) to Hostinger as usual. No special records required beyond standard hosting DNS.

---

## Post-deploy smoke tests

- [ ] Homepage loads at `https://yourdomain.com`
- [ ] `/projects.html` and project pages load
- [ ] `GET /health` returns `{ "ok": true, "service": "audit-backend" }`
- [ ] AI audit intake form at `/projects/ai-audit.html` submits successfully
- [ ] SSL active (padlock in browser)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| App won't start | Check hPanel runtime logs; confirm `npm start` and Node 20.x |
| 502 / connection refused | Server must bind to `0.0.0.0` and use Hostinger's `PORT` |
| Static pages 404 | Confirm `public/` is in the repo; Express serves it from repo root |
| `/submit-audit` returns 500 | Verify `QWEN_API_KEY`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` in hPanel |
| Audit form can't reach API | In production the form uses same-origin (`''` API base); no CORS config needed |
| Local dev opens wrong port | Set `AUDIT_PORT=3001` in `.env`; production uses `PORT` from Hostinger |

## Updates

Push to `main` → Hostinger rebuilds and restarts automatically.

## Vercel fallback

`vercel.json` and `api/index.js` remain for optional Vercel deployment. On Hostinger, the full `server.js` handles both static files and API routes.
