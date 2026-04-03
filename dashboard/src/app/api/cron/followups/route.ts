import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const resend = getResend();

    const { data: dueSequences, error } = await supabase
      .from("sequences")
      .select("*, leads(*)")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .gt("step_number", 0); // Only follow-ups, not initial emails

    if (error) throw error;
    if (!dueSequences || dueSequences.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    const fromEmail = process.env.FROM_EMAIL || "hello@thebuildupshow.com";

    for (const seq of dueSequences) {
      const lead = seq.leads;

      // Skip if lead has moved past "contacted" (e.g. replied, booked)
      if (!lead || !["contacted"].includes(lead.status)) {
        await supabase
          .from("sequences")
          .update({ status: "skipped" })
          .eq("id", seq.id);
        continue;
      }

      if (!lead.email) continue;

      try {
        const { error: sendError } = await resend.emails.send({
          from: `The Build Up <${fromEmail}>`,
          to: [lead.email],
          subject: seq.subject,
          text: seq.message_body,
        });

        if (sendError) {
          console.error(`Failed to send to ${lead.email}:`, sendError);
          continue;
        }

        await supabase
          .from("sequences")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", seq.id);

        await supabase.from("activity_log").insert({
          lead_id: lead.id,
          type: "followup_sent",
          details: { subject: seq.subject, step: seq.step_number },
        });

        sent++;
      } catch (err) {
        console.error(`Error sending follow-up to ${lead.email}:`, err);
      }
    }

    return NextResponse.json({ sent, checked: dueSequences.length });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
