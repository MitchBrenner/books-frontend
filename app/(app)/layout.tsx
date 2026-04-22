"use client";

import { AppNav } from "@/components/navigation/app-nav";
import { useAuth } from "@/lib/auth/use-auth";
import Login from "@/app/login/page";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      {children}
    </div>
  );
}
