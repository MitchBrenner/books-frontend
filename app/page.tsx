"use client";

import { AppNav } from "@/components/navigation/app-nav";
import { useAuth } from "@/lib/auth/use-auth";
import Login from "./login/page";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Feed
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome back, {user.user_metadata.username ?? user.email}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Follow your friends to see what they are reading.
        </p>
      </main>
    </div>
  );
}
