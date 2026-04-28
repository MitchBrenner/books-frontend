"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export function CreateUserForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const trimmedEmail = email.trim();
      const trimmedUsername = username.trim();

      if (!trimmedEmail || !password || !trimmedUsername) {
        throw new Error("Email, username, and password are required.");
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            username: trimmedUsername,
            first_name: firstName.trim() || undefined,
            last_name: lastName.trim() || undefined,
          },
        },
      });

      if (error) throw error;

      setEmail("");
      setPassword("");
      setUsername("");
      setFirstName("");
      setLastName("");

      if (data.session) {
        router.push("/");
        return;
      }

      setSuccessMessage(
        "Account created. Check your email to confirm your account before signing in.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="create-first-name" className="text-sm font-medium text-gray-900">
            First name
          </label>
          <Input
            id="create-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="create-last-name" className="text-sm font-medium text-gray-900">
            Last name
          </label>
          <Input
            id="create-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="create-username" className="text-sm font-medium text-gray-900">
          Username
        </label>
        <Input
          id="create-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="janereads"
          className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="create-email" className="text-sm font-medium text-gray-900">
          Email
        </label>
        <Input
          id="create-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-10 rounded-lg border-gray-200 bg-white px-4 focus-visible:border-black focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="create-password" className="text-sm font-medium text-gray-900">
          Password
        </label>
        <Input
          id="create-password"
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
        {isSubmitting ? "Creating..." : "Create account"}
      </button>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {successMessage ? (
        <p className="text-sm text-gray-500">{successMessage}</p>
      ) : null}
    </form>
  );
}
