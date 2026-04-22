"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogOut, Search, Newspaper } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Feed", icon: Newspaper },
  { href: "/search", label: "Search", icon: Search },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#c8d9c4] bg-[#faf8f4]/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-stretch px-6">
        {/* Brand */}
        <div className="flex items-center gap-2 pr-8">
          <BookOpen className="size-4 text-[#2d4a35]" strokeWidth={2.5} />
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2d4a35]">
            BetterReads
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 text-sm transition-colors",
                  isActive
                    ? "text-[#1a2e1f] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2d4a35]"
                    : "text-[#6b7f6e] hover:text-[#1a2e1f]"
                )}
              >
                <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-[#6b7f6e] transition-colors hover:text-[#1a2e1f]"
          >
            <LogOut className="size-4" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
