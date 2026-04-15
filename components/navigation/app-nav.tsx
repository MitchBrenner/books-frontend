"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Feed" },
  { href: "/search", label: "Search" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            BetterReads
          </span>
          <span className="text-lg font-semibold">Your shelf, socialized</span>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                className={cn("min-w-20", !isActive && "text-muted-foreground")}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
          </nav>
          <Button type="button" variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
