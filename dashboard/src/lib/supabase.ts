import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export type Lead = {
  id: string;
  name: string;
  business: string;
  category: string;
  what_they_do: string;
  revenue: string;
  twitter: string;
  linkedin: string;
  email: string;
  website: string;
  location: string;
  interview_angle: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type LeadStatus =
  | "not_contacted"
  | "contacted"
  | "replied"
  | "booked"
  | "interviewed"
  | "published";

export type Sequence = {
  id: string;
  lead_id: string;
  channel: "email" | "linkedin" | "twitter";
  step_number: number;
  subject: string;
  message_body: string;
  scheduled_for: string;
  sent_at: string | null;
  status: "pending" | "sent" | "skipped" | "paused";
  created_at: string;
};

export type ActivityLog = {
  id: string;
  lead_id: string;
  type: string;
  details: Record<string, unknown>;
  created_at: string;
};

export const STATUS_ORDER: LeadStatus[] = [
  "not_contacted",
  "contacted",
  "replied",
  "booked",
  "interviewed",
  "published",
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  not_contacted: "Not Contacted",
  contacted: "Contacted",
  replied: "Replied",
  booked: "Booked",
  interviewed: "Interviewed",
  published: "Published",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  not_contacted: "bg-gray-100 text-gray-600",
  contacted: "bg-amber-50 text-amber-700",
  replied: "bg-green-50 text-green-700",
  booked: "bg-blue-50 text-blue-700",
  interviewed: "bg-gray-800 text-white",
  published: "bg-green-100 text-green-800",
};

export const STATUS_DOT_COLORS: Record<LeadStatus, string> = {
  not_contacted: "bg-gray-300",
  contacted: "bg-amber-400",
  replied: "bg-green-500",
  booked: "bg-blue-500",
  interviewed: "bg-gray-800",
  published: "bg-green-600",
};
