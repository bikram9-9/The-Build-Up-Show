"use client";

import { STATUS_ORDER, STATUS_LABELS, STATUS_DOT_COLORS, type Lead, type LeadStatus } from "@/lib/supabase";

// Combine interviewed + published into "Done" column
const COLUMNS: { key: LeadStatus | "done"; label: string; statuses: LeadStatus[] }[] = [
  { key: "not_contacted", label: "Not Contacted", statuses: ["not_contacted"] },
  { key: "contacted", label: "Contacted", statuses: ["contacted"] },
  { key: "replied", label: "Replied", statuses: ["replied"] },
  { key: "booked", label: "Booked", statuses: ["booked"] },
  { key: "done", label: "Done", statuses: ["interviewed", "published"] },
];

export function KanbanBoard({
  leads,
  onSelectLead,
}: {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-3 h-[calc(100vh-140px)]">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => col.statuses.includes(l.status));
        const dotColor = STATUS_DOT_COLORS[col.statuses[0]];

        return (
          <div
            key={col.key}
            className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
              <span className="text-xs font-semibold text-gray-900">
                {col.label}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {colLeads.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {colLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="w-full text-left bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{lead.business}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {lead.category}
                    </span>
                    {lead.revenue && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {lead.revenue}
                      </span>
                    )}
                  </div>
                  {lead.location && (
                    <p className="text-[10px] text-gray-400 mt-1.5">{lead.location}</p>
                  )}
                </button>
              ))}
              {colLeads.length === 0 && (
                <p className="text-xs text-gray-300 text-center py-8">
                  No leads
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
