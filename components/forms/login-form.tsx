"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) throw error;

      setError(null);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-900">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-900">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full cursor-pointer rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
