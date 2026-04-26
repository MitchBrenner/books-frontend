"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Home, LibraryBig, LogOut, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shelf", label: "Shelf", icon: LibraryBig },
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
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-gray-100 bg-white px-3 py-6">
      <div className="mb-6 flex items-center gap-2.5 px-3">
        <BookOpen className="size-5" strokeWidth={2.5} />
        <span className="text-base font-bold tracking-tight">BetterBooks</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors",
                isActive
                  ? "bg-gray-100 font-semibold text-black"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black",
              )}
            >
              <Icon className="size-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleSignOut}
        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
      >
        <LogOut className="size-5" strokeWidth={2} />
        Sign out
      </button>
    </aside>
  );
}
