"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, type Lead } from "@/lib/supabase";

export function LeadsTable({
  leads,
  onSelectLead,
}: {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectLead(lead)}
            >
              <TableCell className="font-medium text-gray-900 text-sm">
                {lead.name}
              </TableCell>
              <TableCell className="text-gray-600 text-sm">
                {lead.business}
              </TableCell>
              <TableCell>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {lead.category}
                </span>
              </TableCell>
              <TableCell className="text-gray-600 text-sm">
                {lead.revenue || "—"}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {lead.location || "—"}
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status]}`}
                >
                  {STATUS_LABELS[lead.status]}
                </span>
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </TableCell>
            </TableRow>
          ))}
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                No leads found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-center">
        Showing {leads.length} leads
      </div>
    </div>
  );
}
