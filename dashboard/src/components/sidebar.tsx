"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Pipeline" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[56px] border-r border-gray-200 bg-white flex flex-col items-center py-4 gap-2 shrink-0">
      <Link
        href="/"
        className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-[10px] font-bold mb-4"
      >
        BU
      </Link>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              isActive
                ? "bg-gray-100 text-black"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-4 h-4" />
          </Link>
        );
      })}
    </div>
  );
}
