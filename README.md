# LinkedIn AI Agent — Outreach Management SaaS Dashboard

A production-minded, B2B LinkedIn outreach management and AI automation platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Cloud Firestore**, **Firebase Authentication**, **Google Gemini AI**, and the **HeyReach API**.

---

## 🌟 Architecture & Core Capabilities

### 1. Lead Management & CSV Ingestion
- **Pipeline Organization**: Search, filter, tag, edit, and organize prospects by status (`new`, `qualified`, `in_campaign`, `replied`, `suppressed`).
- **De-Duplication**: Automatic duplicate URL and LinkedIn profile detection upon entry and import.
- **Atomic Batch CSV Import**: Ingests prospect lists with verification against the local suppression blocklist before writing to Cloud Firestore.

### 2. Gemini AI Lead Qualification (Free-Tier Governed)
- **Deterministic ICP Scoring**: Uses Google Gemini (`gemini-3.5-flash-lite` / `gemini-3.8-flash` / `gemini-flash-latest`) to score leads 0–100 against target job titles, company size, and budget authority.
- **Quota Governance**: Local token-bucket rate limiter enforcing free-tier quotas (15 RPM / 1500 RPD) with graceful degradation to avoid interruptions.
- **Strict Guardrails**: Connection invite notes strictly capped at $\le 280$ characters (LinkedIn allows 300). Zero hallucination of fictitious relationships or claims.

### 3. Human-in-the-Loop Review & Approval Queue
- **Zero Unintended Outreach**: AI-drafted connection invites and follow-up messages are held in a review queue.
- **Operator Edit & Approval**: Operators can inspect, edit, approve, or reject drafts before they are dispatched to HeyReach.

### 4. Official HeyReach API Integration
- **Strictly Official Endpoints**:
  - `GET https://api.heyreach.io/api/public/auth/CheckApiKey`: Validates credentials and measures latency.
  - `POST https://api.heyreach.io/api/public/campaign/GetAll`: Fetches active campaigns.
  - `POST https://api.heyreach.io/api/public/li_account/GetAll`: Lists connected LinkedIn sender accounts.
  - `POST https://api.heyreach.io/api/public/campaign/AddLeadsToCampaign`: Enrolls leads in batches of up to 100 with suppression list filtering.
- **Rate Limit Compliance**: Global pacing under HeyReach's 300 req/min limit.

### 5. Reply Ingestion & Gemini AI Intent Triage
- **Inbound Reply Triage**: Automatically categorizes replies into `meeting_request`, `question`, `interested`, `not_interested`, `out_of_office`, or `other`.
- **Auto-Suppression Safety**: Declining prospects (`not_interested`) are immediately added to the suppression list to prevent future messaging.
- **Automated Follow-Up Cancellation**: Inbound prospect replies automatically cancel any pending follow-up tasks for that lead.

### 6. Follow-Up Cadence & Task Scheduler
- **Multi-Step Scheduling**: Custom follow-up cadence engine (`backend/services/scheduler/followUpWorker.ts`).
- **3-Tier Safety Rules**:
  1. Auto-cancels if the prospect has replied.
  2. Auto-cancels if the contact or company is on the suppression list.
  3. Auto-cancels if the parent campaign is paused or completed.
- **Trigger**: Executable via `/api/cron/process-cadence` (compatible with Vercel Cron, external schedulers, or manual UI trigger).

### 7. Security & Immutable Audit Logging
- **Firebase Admin SDK**: Private server routes only; zero client exposure of service account keys.
- **Least-Privilege Security Rules**: Restrictive `firestore.rules` preventing open access.
- **Comprehensive Audit Trail**: Every sync, approval, lead import, AI score, and safety block is recorded in the `activityLogs` Firestore collection.

---

## 🛠️ Technology Stack

| Layer | Technology | Cost / Tier |
|---|---|---|
| **Frontend Framework** | Next.js 16.4.0 (App Router, Turbopack, React 19) | Open Source / Free |
| **Styling** | Tailwind CSS v4, Lucide Icons | Open Source / Free |
| **Authentication** | Firebase Authentication (Email/Password) | Free Spark Tier |
| **Database** | Cloud Firestore | Free Spark Tier |
| **AI Inference** | Google Gemini API (`@google/generative-ai`) | Free Tier (15 RPM) |
| **Outreach Dispatch** | HeyReach Public API (`api.heyreach.io/api/public`) | Authorized Paid Service |
| **Hosting** | Vercel / Netlify / Render | Free Hobby Tier |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (Node 24 recommended)
- A Firebase project with Firestore and Authentication enabled.
- A Google Gemini API key (from Google AI Studio).
- A HeyReach account and API key (from HeyReach Settings → API).

### 2. Environment Variables Configuration
Copy `.env.example` to `.env.local` and populate your credentials:

```bash
cp .env.example .env.local
```

Required keys in `.env.local`:
```env
# HeyReach API
HEYREACH_API_KEY=your_heyreach_api_key_here
HEYREACH_BASE_URL=https://api.heyreach.io/api/public

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite

# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server Only)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Seed Firestore Initial Data (Optional)
To populate Firestore with initial demo leads, campaigns, and suppression entries:
```bash
curl -X POST http://localhost:3000/api/database/seed
```

### 6. Production Build Check
```bash
npm run build
npm start
```

---

## 🔒 Security & Firestore Rules

Deploy the included `firestore.rules` using the Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase use your_project_id
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 🚢 Free-Tier Deployment (Vercel)

1. Push your repository to GitHub (ensure `.env.local` is ignored).
2. Link the repository to [Vercel](https://vercel.com).
3. Under **Project Settings → Environment Variables**, add all environment variables listed above.
4. Deploy! Vercel automatically compiles the Next.js App Router and provisions serverless route handlers for the API routes.

---

## 🛡️ LinkedIn & Outreach Safety Guidelines
- Never exceed HeyReach's recommended daily connection invite pacing (typically 20–40 invites/day per LinkedIn account).
- All AI-drafted messages should pass through human review (`/approvals`) before dispatch.
- Keep the suppression list updated with any competitor domains or opting-out contacts.
