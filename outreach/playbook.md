# The Build Up — Outreach Playbook

## Overview

The Build Up features lesser-known founders making real money — not unicorn fairy tales. We target founders doing $1K-$100K+ MRR (SaaS) or $50K-$2M/year (physical businesses) with small teams of 1-5 people.

## Lead Sources

**Online Communities:**
Indie Hackers (milestones and revenue posts), Reddit (r/SaaS, r/smallbusiness, r/entrepreneur, r/indiehackers), Twitter/X (#buildinpublic, #indiehackers, #microSaaS)

**Product Platforms:**
Product Hunt (new launches with traction), Shopify App Store (apps with high review counts), Chrome Web Store (popular extensions with real users)

**Story Databases:**
Starter Story case studies, podcast guest lists from similar shows (My First Million, Indie Hackers Podcast, How I Built This)

**Physical Business Sources:**
Local business awards, SBA award winners, Etsy top sellers, Amazon FBA success stories, DTC brand directories

## Email Outreach System

### Setup Checklist
- [x] Domain: thebuildupshow.com
- [x] Email: hello@thebuildupshow.com via Google Workspace
- [ ] Email warmup: send 10-20 normal emails/day for 2 weeks before cold outreach
- [ ] Set up SPF, DKIM, and DMARC records on domain
- [ ] Gmail Apps Script installed in Google Sheets

### Email Warmup Protocol
Week 1-2 before any cold outreach:
1. Send 10-20 emails per day to real people (friends, colleagues, newsletter signups)
2. Have them reply to your emails (reply rate matters for sender reputation)
3. Subscribe to a few newsletters with hello@thebuildupshow.com
4. Send and receive from different providers (Gmail, Outlook, Yahoo)

### Sending Best Practices
- Send Tuesday through Thursday, 9am-11am in recipient's timezone
- Max 20-30 cold emails per day from one inbox
- Personalize the first line — always reference something specific about them
- Keep emails under 100 words
- No attachments, no images, no HTML formatting
- No links in first email (hurts deliverability)
- Always include a clear, low-commitment CTA

### Sequence
1. **Day 0:** Initial cold email
2. **Day 3:** Follow-up #1
3. **Day 7:** Follow-up #2 (final)

See `templates/email-templates.md` for all templates.

## LinkedIn Outreach System

### Daily Routine (15-20 minutes)
1. Send 10-15 personalized connection requests
2. Like/comment on 5-10 target founders' posts
3. Reply to any accepted connections with interview pitch

### Strategy
- Engage with their content for a week BEFORE sending a connection request
- Your comment should add genuine value, not just "Great post!"
- After they accept, wait 24 hours before pitching
- Never use LinkedIn automation tools — account ban risk is high

See `templates/linkedin-templates.md` for all templates.

## Twitter/X Outreach System

### Strategy: Reply-then-DM
This has 2-3x higher response rates than cold DMs:
1. Follow target founders
2. Create a Twitter List called "Build Up Targets"
3. Reply to their tweets with genuine value for 1-2 weeks
4. Once they've engaged with your replies, send a casual DM

### Hashtags to Monitor
#buildinpublic, #indiehackers, #microSaaS, #solofounder, #bootstrapped, #MRR, #saas, #smallbusiness

See `templates/twitter-templates.md` for all templates.

## Weekly Workflow

| Day | Task |
|-----|------|
| Monday | Research 10 new leads, add to leads folder |
| Tuesday | Send cold emails (batch of 15-20) |
| Wednesday | LinkedIn connection requests + Twitter engagement |
| Thursday | More cold emails + LinkedIn follow-ups |
| Friday | Follow up on all pending leads, update statuses |
| Weekend | Engage with founder content on social media (casual) |

## Tracking & Metrics

### Status Pipeline
Not Contacted → Contacted → Replied → Booked → Interviewed → Published

### Target Metrics
- **Reply Rate:** 20%+ (aim for 1 in 5 responding)
- **Book Rate:** 10%+ (aim for 1 in 10 booking a call)
- **Show-up Rate:** 80%+ (send calendar invite + reminder)

### What to Track
- Total leads added per week
- Emails sent per week
- Reply rate by channel (email vs LinkedIn vs Twitter)
- Book rate
- Best performing email subject lines
- Which lead sources produce the most replies

## Gmail Apps Script

Set this up in Google Sheets to automate email sequences. Go to Extensions > Apps Script and paste the code from the outreach playbook document.

The script will:
- Read lead data from your Google Sheet
- Send personalized emails from hello@thebuildupshow.com
- Track sent dates
- Automatically send follow-ups after 3 and 7 days
- Skip leads who have already replied
