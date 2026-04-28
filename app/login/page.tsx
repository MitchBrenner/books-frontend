"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { LoginForm } from "@/components/forms/login-form";

export function Login() {
  const [page, setPage] = useState<"login" | "create">("login");

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-black p-12 lg:flex lg:w-1/2">
        <div className="flex items-center gap-2.5">
          <BookOpen className="size-5 text-white" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-tight text-white">BetterBooks</span>
        </div>

        <div className="flex flex-col gap-4">
          <blockquote className="text-3xl font-semibold leading-snug text-white">
            &ldquo;A reader lives a thousand lives before he dies.&rdquo;
          </blockquote>
          <p className="text-sm text-gray-400">— George R.R. Martin</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-16">
        {/* Mobile-only brand */}
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <BookOpen className="size-5" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-tight">BetterBooks</span>
        </div>

        <div className="w-full max-w-sm">
          {page === "login" ? (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-black">Welcome back</h1>
                <p className="text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="cursor-pointer font-medium text-black underline underline-offset-4"
                    onClick={() => setPage("create")}
                  >
                    Sign up
                  </button>
                </p>
              </div>
              <LoginForm />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-black">Create an account</h1>
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="cursor-pointer font-medium text-black underline underline-offset-4"
                    onClick={() => setPage("login")}
                  >
                    Sign in
                  </button>
                </p>
              </div>
              <CreateUserForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
