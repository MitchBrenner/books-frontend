"use client";

import { useAuth } from "@/lib/auth/use-auth";

export default function Home() {
  const { user } = useAuth();
  const name = user?.user_metadata.username ?? user?.email;

  return (
    <main className="mx-auto max-w-3xl px-8 py-12">
      <h1 className="text-2xl font-bold text-black">
        Welcome back{name ? `, ${name}` : ""}
      </h1>
      <p className="mt-1.5 text-sm text-gray-500">
        Follow your friends to see what they&apos;re reading.
      </p>
    </main>
  );
}
