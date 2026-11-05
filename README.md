# Algorithm Tracker

Creator intelligence workspace for discovering content opportunities, comparing platform signals, and planning videos.

> **Current status: MVP foundation / DEMO mode.** The interface and local interactions are implemented. Trend samples are explicitly illustrative and are not live platform statistics. No production API integration is claimed yet.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 (PostCSS integration) + custom product styling
- Recharts for analytical visualizations
- Lucide React icons
- Provider adapter contracts prepared for YouTube, TikTok and X

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Node.js 22 LTS is a suitable local runtime.

## MVP included

- Responsive dark creator-intelligence dashboard.
- Navigation for Overview, Live Trends, Platform Activity, Video Potential, AI Content Lab, Creator Radar, Competitor Tracker, Saved Trends, Alerts, Growth Planner and Settings.
- Category, subcategory, platform, region, period, search and sorting controls.
- Trend detail view with transparent score labels and sample momentum chart.
- Saved trends persisted in browser local storage.
- AI Content Lab interaction with clearly labeled local demo generation (not a connected LLM).
- Video Potential input flow that uses the creator-provided view average as a baseline and refuses to invent view ranges or success probabilities without comparable historical data.
- Provider contracts and unconfigured adapters for YouTube, TikTok and X.
- Score functions with documented weights and explicit 0–100 normalization requirement.
- Supabase SQL migration with user-owned tables and row-level security policies.

## Data integrity rules

1. Every built-in trend is marked `source: "DEMO"` and the UI displays a DEMO environment banner.
2. The demo chart is an illustrative normalized index, not raw cross-platform engagement.
3. Unconfigured providers return no metrics. A detected environment variable is not treated as proof that the provider is fully integrated.
4. TikTok access must be validated for the specific commercial use case before enabling a connector. No scraping adapter is included.
5. Video view scenarios and probabilities are deliberately withheld until creator history and comparable benchmark data are available.

## Score model (MVP baseline)

`src/lib/scoring.ts` defines normalized 0–100 inputs. Normalization must happen per platform, category and time window before scores are compared.

**Trend Score**

- Velocity: 28%
- Acceleration: 18%
- Relative engagement: 18%
- Recency: 14%
- Cross-platform spread: 12%
- Inverse saturation: 10%

**Opportunity Score**

- Velocity: 20%
- Acceleration: 15%
- Relative engagement: 15%
- Recency: 10%
- Cross-platform spread: 10%
- Inverse creator competition: 15%
- Inverse saturation: 15%

**Saturation Score**

- Creator competition: 45%
- Saturation input: 40%
- Inverse relative engagement: 15%

These are starting weights for experimentation, not empirically calibrated claims. Calibrate them against observed outcomes before using them in production.

## Database foundation

`supabase/migrations/0001_initial_schema.sql` defines the initial user, trend, metric snapshot, score, channel, saved trend, alert, idea, prediction and content-calendar tables. User-owned records are protected by RLS. Trend write ingestion is intended to run server-side with the service role; do not expose that key in the browser.

## Environment variables

Copy `.env.example` to `.env.local`. Keep all secret keys server-side. Never prefix private credentials with `NEXT_PUBLIC_`.

- `YOUTUBE_API_KEY`: YouTube Data API v3.
- `X_BEARER_TOKEN`: X API access, according to current plan permissions.
- `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`: only for an approved product/API integration.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only database administration.
- `AI_API_KEY`: server-only model provider key.

## Next implementation milestones

1. Add Supabase schema, auth, RLS and persistent user preferences.
2. Implement and test the YouTube Data API adapter, quotas, caching and source timestamps.
3. Validate X API access and expose supported search/volume signals.
4. Decide on a TikTok authorized data source before writing its adapter.
5. Add scheduled ingestion and immutable metric snapshots.
6. Calibrate scoring and prediction intervals from comparable historical data.
7. Connect a server-side AI provider for content analysis and original ideation.

## Important production gaps

Authentication, database persistence, background ingestion, live APIs, real LLM calls, email/push delivery, and statistical prediction calibration are not yet implemented. Pages for Creator Radar, Competitor Tracker, Alerts and Growth Planner currently communicate their unconnected state rather than fabricating data.

## Deploy on GitHub Pages (free static hosting)

This repository is configured for GitHub Pages as a static Next.js export.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site.
4. The project site URL is: https://silverwalldiscs.github.io/Algorithm-Tracker/

The build sets the `/Algorithm-Tracker` base path only in GitHub Actions. Local development remains available at http://localhost:3000.

### Static hosting and private services

GitHub Pages serves the frontend only. It does not run Next.js API routes, Server Actions, or a Node.js server. Use Supabase for Auth and Postgres, and Supabase Edge Functions for calls that need private credentials (Gemini and YouTube). Keep secret keys in Supabase Function Secrets, never in this repository or browser code.

The Supabase publishable/anon key may be present in the browser only when Row Level Security is enabled and every table has appropriate policies. Never expose a Supabase secret/service-role key.

### Cost and quota safeguards

- Stay on Supabase Free; monitor project usage and do not upgrade automatically.
- The free Supabase plan currently includes 500,000 Edge Function invocations. The free plan blocks over-quota usage rather than charging an overage; check current billing settings before enabling any paid plan.
- YouTube Data API calls use project quota. Cache responses and avoid repeatedly running `search.list`.
- Gemini's free tier has model-specific rate limits. Add per-user throttling and request limits in the Edge Function. Google states that free-tier content may be used to improve its products; do not send sensitive creator or account information.

### Current limitations

This deployment does not make the provider adapters live by itself. Supabase project credentials, SQL migration, Edge Functions, official API credentials and OAuth configuration must still be set up. TikTok and X remain disabled until an authorized free data source is available.
