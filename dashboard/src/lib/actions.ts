"use server";

import { supabase, isConfigured, type Lead, type LeadStatus } from "./supabase";

export async function getLeads() {
  if (!isConfigured) return [] as Lead[];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function getLead(id: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  await supabase.from("activity_log").insert({
    lead_id: id,
    type: "status_changed",
    details: { to: status },
  });
}

export async function updateLeadNotes(id: string, notes: string) {
  const { error } = await supabase
    .from("leads")
    .update({ notes, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function getSequences(leadId: string) {
  const { data, error } = await supabase
    .from("sequences")
    .select("*")
    .eq("lead_id", leadId)
    .order("step_number", { ascending: true });
  if (error) throw error;
  return data;
}

export async function startSequence(lead: Lead) {
  const now = new Date();
  const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const initialSubject = `Your ${lead.business} story`;
  const initialBody = `Hey ${lead.name.split(" ")[0]},

I run The Build Up — we tell the real stories behind businesses that are actually making money. Not the unicorn fairy tales, the real stuff.

I came across ${lead.business} and ${lead.interview_angle || "your story really caught my eye"}.

Would you be down for a casual 20-30 min chat? No prep, no script — just how you actually built it.

- Bikram
The Build Up
hello@thebuildupshow.com`;

  const followup1Body = `Hey ${lead.name.split(" ")[0]},

Just bumping this — I know you're busy actually running a business (unlike most people tweeting about it).

We recently featured founders with similar stories and they blew up. Would love to do the same for ${lead.business}.

20 mins, totally casual. Down?

- Bikram`;

  const followup2Body = `Hey ${lead.name.split(" ")[0]},

Final follow-up. Just think your story with ${lead.business} is the kind of real talk that actually helps people.

If timing's off, no stress at all. But if you're open to it, I'd love to make it happen.

- Bikram
The Build Up`;

  const sequences = [
    {
      lead_id: lead.id,
      channel: "email",
      step_number: 0,
      subject: initialSubject,
      message_body: initialBody,
      scheduled_for: now.toISOString(),
      status: "pending",
    },
    {
      lead_id: lead.id,
      channel: "email",
      step_number: 1,
      subject: `Re: ${initialSubject}`,
      message_body: followup1Body,
      scheduled_for: day3.toISOString(),
      status: "pending",
    },
    {
      lead_id: lead.id,
      channel: "email",
      step_number: 2,
      subject: "Last one from me",
      message_body: followup2Body,
      scheduled_for: day7.toISOString(),
      status: "pending",
    },
  ];

  const { error } = await supabase.from("sequences").insert(sequences);
  if (error) throw error;

  // Send the first email immediately
  await sendSequenceEmail(lead, sequences[0]);

  // Update lead status
  await updateLeadStatus(lead.id, "contacted");

  await supabase.from("activity_log").insert({
    lead_id: lead.id,
    type: "sequence_started",
    details: { steps: 3 },
  });
}

async function sendSequenceEmail(
  lead: Lead,
  seq: { subject: string; message_body: string; step_number: number }
) {
  if (!lead.email) return;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : ""}${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/send-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: lead.email,
        subject: seq.subject,
        body: seq.message_body,
        leadId: lead.id,
        stepNumber: seq.step_number,
      }),
    }
  );

  if (!res.ok) {
    console.error("Failed to send email:", await res.text());
  }
}

export async function pauseSequenceStep(sequenceId: string) {
  const { error } = await supabase
    .from("sequences")
    .update({ status: "paused" })
    .eq("id", sequenceId);
  if (error) throw error;
}

export async function skipSequenceStep(sequenceId: string) {
  const { error } = await supabase
    .from("sequences")
    .update({ status: "skipped" })
    .eq("id", sequenceId);
  if (error) throw error;
}

export async function getActivityLog(leadId?: string) {
  if (!isConfigured) return [];
  let query = supabase
    .from("activity_log")
    .select("*, leads(name, business)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (leadId) {
    query = query.eq("lead_id", leadId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
