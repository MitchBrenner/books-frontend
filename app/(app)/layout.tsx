"use client";

import { AppNav } from "@/components/navigation/app-nav";
import { useAuth } from "@/lib/auth/use-auth";
import Login from "@/app/login/page";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Toaster position="top-right" />
      <AppNav />
      {children}
    </div>
  );
}
