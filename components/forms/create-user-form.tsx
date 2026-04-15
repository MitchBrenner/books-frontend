"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

      if (error) {
        throw error;
      }

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
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="create-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="create-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="create-password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="create-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="create-username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="create-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="create-first-name" className="text-sm font-medium">
          First name
        </label>
        <Input
          id="create-first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="create-last-name" className="text-sm font-medium">
          Last name
        </label>
        <Input
          id="create-last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create account"}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {successMessage ? (
        <p className="text-sm text-muted-foreground">{successMessage}</p>
      ) : null}
    </form>
  );
}
