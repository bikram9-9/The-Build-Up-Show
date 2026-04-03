import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, leadId, stepNumber } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const resend = getResend();
    const supabase = getSupabase();
    const fromEmail = process.env.FROM_EMAIL || "hello@thebuildupshow.com";

    const { data, error } = await resend.emails.send({
      from: `The Build Up <${fromEmail}>`,
      to: [to],
      subject,
      text: body,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (leadId) {
      await supabase
        .from("sequences")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("lead_id", leadId)
        .eq("step_number", stepNumber)
        .eq("status", "pending");

      await supabase.from("activity_log").insert({
        lead_id: leadId,
        type: stepNumber === 0 ? "email_sent" : "followup_sent",
        details: { subject, step: stepNumber, resend_id: data?.id },
      });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
