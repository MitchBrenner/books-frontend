"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserByUsername } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LOCAL_STORAGE_KEY = "books.currentUser";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Username is required.");
      setSavedMessage(null);
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await getUserByUsername(trimmedUsername);

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));

      setError(null);
      setSavedMessage(`Signed in as ${user.username}.`);
      setUsername("");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setSavedMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Continue"}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {savedMessage ? (
        <p className="text-sm text-muted-foreground">{savedMessage}</p>
      ) : null}
    </form>
  );
}
