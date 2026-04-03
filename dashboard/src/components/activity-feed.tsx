"use client";

import { formatDistanceToNow } from "@/lib/date-utils";

type Activity = {
  id: string;
  lead_id: string;
  type: string;
  details: Record<string, unknown>;
  created_at: string;
  leads?: { name: string; business: string } | null;
};

const typeLabels: Record<string, string> = {
  email_sent: "Email sent",
  followup_sent: "Follow-up sent",
  status_changed: "Status changed",
  note_added: "Note added",
  sequence_started: "Sequence started",
};

const typeColors: Record<string, string> = {
  email_sent: "bg-blue-100 text-blue-700",
  followup_sent: "bg-amber-100 text-amber-700",
  status_changed: "bg-gray-100 text-gray-700",
  note_added: "bg-gray-100 text-gray-600",
  sequence_started: "bg-green-100 text-green-700",
};

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No activity yet. Start a sequence to get going.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <div
          key={a.id}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3"
        >
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${typeColors[a.type] || "bg-gray-100 text-gray-600"}`}
          >
            {typeLabels[a.type] || a.type}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              {a.leads?.name && (
                <span className="font-medium">{a.leads.name}</span>
              )}
              {a.leads?.business && (
                <span className="text-gray-500"> — {a.leads.business}</span>
              )}
            </p>
            {a.details && Object.keys(a.details).length > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {a.type === "status_changed" && `→ ${a.details.to}`}
                {a.type === "sequence_started" && `${a.details.steps} step sequence`}
                {a.type === "email_sent" && (a.details.subject as string)}
              </p>
            )}
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {formatDistanceToNow(a.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
}
