"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser } from "@/lib/api/users";
import { useState } from "react";

export function CreateUserForm() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // create user
      await createUser({
        username,
        firstName,
        lastName,
      });
      // if successfull login in
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
        {isSubmitting ? "Creating..." : "Create user"}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
