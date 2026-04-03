# Email Warmup & Deliverability Guide

Your emails will go straight to spam if you skip this. Follow every step.

## Step 1: DNS Records (do this first)

You need 3 records set up on your Squarespace domain (thebuildupshow.com). Go to Squarespace > Domains > DNS Settings.

### SPF Record
- **Type:** TXT
- **Host:** @
- **Value:** `v=spf1 include:_spf.google.com ~all`
- **What it does:** Tells email providers "Google is authorized to send emails from this domain"

### DKIM Record
- **Where to find it:** Google Admin Console > Apps > Google Workspace > Gmail > Authenticate Email
- **Type:** TXT
- Google will give you the exact record to add
- **What it does:** Digitally signs your emails so they can't be spoofed

### DMARC Record
- **Type:** TXT
- **Host:** _dmarc
- **Value:** `v=DMARC1; p=none; rua=mailto:hello@thebuildupshow.com`
- **What it does:** Tells email providers what to do with emails that fail SPF/DKIM checks

## Step 2: Warm Up the Inbox (2 weeks minimum)

Brand new email addresses have zero sender reputation. Gmail, Outlook, and Yahoo will flag you as spam if you start blasting cold emails from day one.

### Week 1
- Send 5-10 emails per day to real people (friends, family, past colleagues)
- Ask them to reply to you (replies = huge signal that you're legit)
- Subscribe to 5-10 newsletters with hello@thebuildupshow.com
- Send a few emails to your personal Gmail, Outlook, and Yahoo accounts — reply to them from those accounts

### Week 2
- Increase to 15-20 emails per day
- Keep getting replies
- Join 2-3 email threads / group conversations
- Send a few test cold emails to friends and ask them to check if it landed in Primary inbox or Spam

### Week 3+
- Start cold outreach at 10 emails/day
- Gradually increase to 20-30/day over the next 2 weeks
- Never exceed 50 cold emails/day from one inbox

## Step 3: Cold Email Best Practices for Deliverability

### Do
- Keep emails short (under 100 words)
- Write like a real person, not a marketer
- Use plain text — no HTML templates, no images
- Include your name and one line about The Build Up
- Personalize the first sentence for every single email
- Send during business hours (9am-11am recipient's timezone)
- Space out your sends (don't blast 20 emails in 5 minutes)

### Don't
- No links in first email (Google flags this)
- No attachments ever
- No images or logos in signature
- No ALL CAPS in subject lines
- No spam trigger words: "free", "guarantee", "limited time", "act now"
- Never buy email lists
- Never send more than 50/day from one inbox
- Don't use mail merge tools that send all at once — stagger them

## Step 4: Monitor Your Sender Reputation

### Google Postmaster Tools (free)
- Go to: postmaster.tools.google.com
- Add thebuildupshow.com
- Check your domain reputation weekly
- If it drops below "Medium", pause cold emails immediately

### What Kills Your Reputation
- People marking you as spam (even 1-2% spam rate is bad)
- High bounce rate (sending to invalid emails)
- Low open rates (means your emails are going to spam)
- Sending too many too fast

### Recovery if You Get Flagged
1. Stop all cold email immediately
2. Only send warm emails for 2 weeks
3. Get as many replies as possible
4. Check Postmaster Tools until reputation recovers
5. Resume cold email at 5/day and slowly ramp back up

## Optional: Email Warmup Tools (paid)

If you want to speed up warmup, these tools automatically send and reply to emails to build reputation:
- Instantly.ai warm-up (included in their $30/mo plan)
- Warmup Inbox ($9/mo)
- Lemwarm by Lemlist ($29/mo)

These aren't required if you do manual warmup properly, but they help maintain reputation long-term.
