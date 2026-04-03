# The Build Up — Outreach Dashboard

## Overview

Multi-channel outreach dashboard for The Build Up Show. Solo-user tool to manage podcast guest leads, send emails via Resend, track pipeline status, and coordinate LinkedIn/Twitter outreach from one place.

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
- **Database:** Supabase (Postgres)
- **Email:** Resend (hello@thebuildupshow.com)
- **Deploy:** Vercel
- **Scheduling:** Vercel Cron Jobs (hourly check for due follow-ups)
- **Lead population:** Claude scheduled tasks push directly to Supabase

## Data Model

### `leads` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| name | text | required |
| business | text | required |
| category | text | Micro-SaaS, Chrome/Shopify, E-commerce/Physical, Service, City Tour |
| what_they_do | text | one-line description |
| revenue | text | free-text (e.g. "$130K/mo") |
| twitter | text | handle |
| linkedin | text | URL |
| email | text | email address |
| website | text | URL |
| location | text | city/country |
| interview_angle | text | why they're a good guest |
| status | text | not_contacted, contacted, replied, booked, interviewed, published |
| notes | text | free-text |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `sequences` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| lead_id | uuid (FK → leads) | |
| channel | text | email, linkedin, twitter |
| step_number | int | 0 = initial, 1 = follow-up #1, 2 = follow-up #2 |
| subject | text | email subject line |
| message_body | text | full message content |
| scheduled_for | timestamptz | when to send |
| sent_at | timestamptz | null until sent |
| status | text | pending, sent, skipped, paused |
| created_at | timestamptz | default now() |

### `activity_log` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| lead_id | uuid (FK → leads) | |
| type | text | email_sent, followup_sent, status_changed, note_added, sequence_started |
| details | jsonb | context (e.g. { "from": "contacted", "to": "replied" }) |
| created_at | timestamptz | default now() |

## Pages & UI

### Layout
- Collapsed icon sidebar (left): BU logo, Pipeline, Activity, Settings icons
- Light mode, clean — grays, black, status colors only (amber, green, blue)
- No purple anywhere

### Pipeline Page (home) — two views with toggle
**Board View (Kanban):**
- 5 columns: Not Contacted, Contacted, Replied, Booked, Done (Interviewed + Published)
- Lead cards show: name, business, category tag, revenue, contextual badge (e.g. "Follow-up due")
- Click card → opens lead detail slide-over

**Table View:**
- Search bar at top
- Columns: Name, Business, Category, Revenue, Status, Next Step
- Sortable, filterable
- Click row → opens lead detail slide-over
- Board/Table toggle in top-right toolbar

### Lead Detail (Slide-over panel from right)
- Header: Name, Business, Category, Revenue
- Links: Twitter, LinkedIn, Website (icon buttons, open in new tab)
- Status: dropdown to change pipeline stage
- Sequence section:
  - Current status (e.g. "Step 1/3 — sent 2d ago")
  - Next action + scheduled time
  - Pause/Skip buttons
  - "Start Sequence" button if not started
- Social outreach:
  - Draft LinkedIn message (editable + copy button)
  - Draft Twitter DM (editable + copy button)
  - Profile links
- Activity timeline: chronological log
- Notes: editable text area
- Interview Angle: displayed prominently

### Activity Page
- Chronological feed of all actions across all leads
- Filterable by type (emails, status changes, notes)

### Settings Page
- Resend API key
- From email address (hello@thebuildupshow.com)
- Follow-up timing (Day 3, Day 7 — configurable)
- Email templates (initial, follow-up #1, follow-up #2)

## Email Flow

1. Click "Start Sequence" on a lead
2. System creates 3 sequence rows:
   - Step 0: Initial email — sends immediately via Resend
   - Step 1: Follow-up #1 — scheduled for Day 3
   - Step 2: Follow-up #2 — scheduled for Day 7
3. Templates auto-fill with lead data (name, company, interview angle)
4. Lead status moves to "contacted"
5. Vercel cron job runs hourly, picks up due follow-ups, sends via Resend
6. If lead status changes to "replied" or beyond, pending follow-ups auto-skip

## Social Outreach Flow

1. In lead detail, LinkedIn and Twitter sections show pre-generated draft messages
2. Messages use templates from `templates/` filled with lead data
3. User can edit the draft, then click copy button
4. Direct links to the lead's LinkedIn/Twitter profile to paste the message
5. After copying/sending, user marks it done → logged to activity

## Auto Follow-up Logic

- Vercel cron job: `/api/cron/followups` — runs every hour
- Queries sequences where `status = 'pending'` AND `scheduled_for <= now()`
- Checks if lead status is still `contacted` (skip if replied/booked/etc.)
- Sends via Resend, updates sequence `status = 'sent'`, `sent_at = now()`
- Logs to activity_log
- Secured with `CRON_SECRET` env var

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
FROM_EMAIL=hello@thebuildupshow.com
CRON_SECRET=
```
