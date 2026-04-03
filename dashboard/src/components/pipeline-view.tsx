"use client";

import { useState } from "react";
import { LayoutGrid, List, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban-board";
import { LeadsTable } from "@/components/leads-table";
import { LeadDetail } from "@/components/lead-detail";
import type { Lead } from "@/lib/supabase";

type View = "board" | "table";

export function PipelineView({ leads: initialLeads }: { leads: Lead[] }) {
  const [view, setView] = useState<View>("board");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState(initialLeads);

  const filteredLeads = leads.filter((lead) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.business.toLowerCase().includes(q) ||
      lead.category.toLowerCase().includes(q) ||
      (lead.location && lead.location.toLowerCase().includes(q))
    );
  });

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  const statusCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500">
            {leads.length} leads across {Object.keys(statusCounts).length} stages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg border border-gray-200 p-0.5">
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "board"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "table"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table
            </button>
          </div>
        </div>
      </div>

      {view === "table" && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>
      )}

      {view === "board" ? (
        <KanbanBoard leads={filteredLeads} onSelectLead={setSelectedLead} />
      ) : (
        <LeadsTable leads={filteredLeads} onSelectLead={setSelectedLead} />
      )}

      <LeadDetail
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleLeadUpdate}
      />
    </>
  );
}
