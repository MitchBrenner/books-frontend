"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/navigation/app-nav";
import { useAuth } from "@/lib/auth/use-auth";
import Login from "@/app/login/page";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !user.user_metadata?.username) {
      router.push("/onboarding");
    }
  }, [isLoading, user, router]);

  if (isLoading) return null;
  if (!user) return <Login />;
  if (!user.user_metadata?.username) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" />
      <AppNav />
      <div className="flex-1 pl-60">{children}</div>
    </div>
  );
}
