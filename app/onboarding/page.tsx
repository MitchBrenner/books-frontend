"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function Onboarding() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("Username is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated.");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: trimmedUsername,
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
        })
        .eq("id", user.id);

      if (profileError) {
        if (profileError.code === "23505") {
          setError("That username is already taken. Please choose another.");
          setIsSubmitting(false);
          return;
        }
        throw profileError;
      }

      await supabase.auth.updateUser({
        data: {
          username: trimmedUsername,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
        },
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-8">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-center gap-2">
          <BookOpen className="size-5" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-tight">BetterBooks</span>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-black">One last step</h1>
            <p className="text-sm text-gray-500">
              Choose a username to complete your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-gray-900">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janereads"
                className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="first-name" className="text-sm font-medium text-gray-900">
                  First name
                </label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="last-name" className="text-sm font-medium text-gray-900">
                  Last name
                </label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full cursor-pointer rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Get started"}
            </button>

            <p className={`text-sm text-red-500 ${error ? "visible" : "invisible"}`}>
              {error ?? "placeholder"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
