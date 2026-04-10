"use client";
import { Button } from "@/components/ui/button";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { LoginForm } from "@/components/forms/login-form";
import { useState } from "react";

export function Login() {
  const [page, setPage] = useState<"login" | "create">("login");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="flex w-full max-w-xl flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            BetterReads
          </p>
          <h1 className="text-3xl font-semibold">Build your reading shelf</h1>
        </div>

        {page === "login" && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Sign in with a username</h2>
            <LoginForm />
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 text-sm"
                onClick={() => setPage("create")}
              >
                Create one here
              </Button>
            </p>
          </div>
        )}

        {page === "create" && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Create an account</h2>
            <CreateUserForm />
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 text-sm"
                onClick={() => setPage("login")}
              >
                Sign in here
              </Button>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Login;
