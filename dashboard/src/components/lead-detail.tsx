"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Mail,
  Copy,
  Check,
  Play,
  Pause,
  SkipForward,
  MapPin,
  ExternalLink,
} from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ORDER,
  type Lead,
  type LeadStatus,
} from "@/lib/supabase";
import {
  updateLeadStatus,
  updateLeadNotes,
  startSequence,
  getSequences,
  pauseSequenceStep,
  skipSequenceStep,
} from "@/lib/actions";
import { formatDate, formatDistanceToNow } from "@/lib/date-utils";

export function LeadDetail({
  lead,
  open,
  onClose,
  onUpdate,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
}) {
  const [notes, setNotes] = useState("");
  const [sequences, setSequences] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      loadSequences(lead.id);
    }
  }, [lead]);

  async function loadSequences(leadId: string) {
    try {
      const data = await getSequences(leadId);
      setSequences(data || []);
    } catch {
      setSequences([]);
    }
  }

  async function handleStatusChange(status: LeadStatus) {
    if (!lead) return;
    await updateLeadStatus(lead.id, status);
    onUpdate({ ...lead, status });
  }

  async function handleSaveNotes() {
    if (!lead) return;
    await updateLeadNotes(lead.id, notes);
    onUpdate({ ...lead, notes });
  }

  async function handleStartSequence() {
    if (!lead) return;
    setLoading(true);
    try {
      await startSequence(lead);
      onUpdate({ ...lead, status: "contacted" });
      await loadSequences(lead.id);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!lead) return null;

  const linkedinMessage = `Hey ${lead.name.split(" ")[0]} — I run The Build Up where we feature founders making real money with real businesses. No unicorn hype. Would love to connect and hear your ${lead.business} story.`;

  const twitterDM = `Hey ${lead.name.split(" ")[0]}! I run The Build Up — we tell real founder stories. No PR fluff.\n\n${lead.interview_angle || `Your work on ${lead.business}`} caught my eye. Would love to feature you. 20 min casual chat. Interested?`;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader className="text-left mb-1">
            <SheetTitle className="text-lg font-semibold text-gray-900">
              {lead.name}
            </SheetTitle>
          </SheetHeader>
          <p className="text-sm text-gray-600 mb-1">{lead.business}</p>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {lead.category}
            </span>
            {lead.revenue && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {lead.revenue}
              </span>
            )}
            {lead.location && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {lead.location}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-2 mb-4">
            {lead.twitter && (
              <a
                href={`https://x.com/${lead.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
                {lead.twitter}
              </a>
            )}
            {lead.linkedin && (
              <a
                href={lead.linkedin.startsWith("http") ? lead.linkedin : `https://${lead.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
            {lead.website && (
              <a
                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                Website
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            )}
          </div>

          {/* Status */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Status
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                    lead.status === s
                      ? STATUS_COLORS[s] + " ring-1 ring-gray-300"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <Separator className="mb-5" />

          {/* Interview Angle */}
          {lead.interview_angle && (
            <div className="mb-5">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Interview Angle
              </label>
              <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3">
                {lead.interview_angle}
              </p>
            </div>
          )}

          {/* What they do */}
          {lead.what_they_do && (
            <div className="mb-5">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                What They Do
              </label>
              <p className="text-sm text-gray-600">{lead.what_they_do}</p>
            </div>
          )}

          <Separator className="mb-5" />

          {/* Email Sequence */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Email Sequence
            </label>
            {sequences.length === 0 ? (
              <div>
                <p className="text-xs text-gray-400 mb-2">No sequence started yet</p>
                <Button
                  size="sm"
                  onClick={handleStartSequence}
                  disabled={loading || !lead.email}
                  className="bg-black text-white hover:bg-gray-800 text-xs"
                >
                  <Play className="w-3 h-3 mr-1.5" />
                  {loading ? "Starting..." : "Start Sequence"}
                </Button>
                {!lead.email && (
                  <p className="text-xs text-amber-600 mt-1">No email address — add one to start a sequence</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {sequences
                  .filter((s: any) => s.channel === "email")
                  .map((seq: any, i: number) => (
                    <div
                      key={seq.id}
                      className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {i === 0 ? "Initial Email" : `Follow-up #${i}`}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            seq.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : seq.status === "pending"
                                ? "bg-amber-50 text-amber-600"
                                : seq.status === "paused"
                                  ? "bg-gray-200 text-gray-600"
                                  : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {seq.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {seq.sent_at
                          ? `Sent ${formatDistanceToNow(seq.sent_at)}`
                          : `Scheduled: ${formatDate(seq.scheduled_for)}`}
                      </p>
                      {seq.status === "pending" && (
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() => pauseSequenceStep(seq.id)}
                            className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-0.5"
                          >
                            <Pause className="w-3 h-3" /> Pause
                          </button>
                          <button
                            onClick={() => skipSequenceStep(seq.id)}
                            className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-0.5"
                          >
                            <SkipForward className="w-3 h-3" /> Skip
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Separator className="mb-5" />

          {/* Social Outreach Drafts */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Social Outreach
            </label>
            <div className="space-y-3">
              {lead.linkedin && (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <LinkedinIcon className="w-3 h-3" /> LinkedIn Message
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(linkedinMessage, "linkedin")}
                        className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                      >
                        {copied === "linkedin" ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copied === "linkedin" ? "Copied" : "Copy"}
                      </button>
                      <a
                        href={lead.linkedin.startsWith("http") ? lead.linkedin : `https://${lead.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" /> Open
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 whitespace-pre-wrap">
                    {linkedinMessage}
                  </p>
                </div>
              )}
              {lead.twitter && (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <TwitterIcon className="w-3 h-3" /> Twitter/X DM
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(twitterDM, "twitter")}
                        className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                      >
                        {copied === "twitter" ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copied === "twitter" ? "Copied" : "Copy"}
                      </button>
                      <a
                        href={`https://x.com/${lead.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" /> Open
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 whitespace-pre-wrap">
                    {twitterDM}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="mb-5" />

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
              Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="text-sm min-h-[80px] mb-2"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              className="text-xs"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
