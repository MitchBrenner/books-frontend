"use client";

import { CreateUserForm } from "@/components/forms/create-user-form";
import { LoginForm } from "@/components/forms/login-form";
import { useState } from "react";

export function Login() {
  const [page, setPage] = useState<"login" | "create">("login");

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#2d4a35] p-12 lg:flex lg:w-1/2">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#3d6449]/40" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-112 w-md rounded-full bg-[#1e3326]/60" />

        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#a8c5a0]">
            BetterReads
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <blockquote className="text-3xl font-semibold leading-snug text-[#f0ebe0]">
            "A reader lives a thousand lives before he dies."
          </blockquote>
          <p className="text-sm text-[#a8c5a0]">— George R.R. Martin</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#faf8f4] px-8 py-16">
        {/* Mobile-only brand */}
        <p className="mb-8 text-sm font-medium uppercase tracking-[0.3em] text-[#4a7c59] lg:hidden">
          BetterReads
        </p>

        <div className="w-full max-w-sm">
          {page === "login" ? (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold text-[#1a2e1f]">Welcome back</h1>
                <p className="text-sm text-[#6b7f6e]">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-[#3d6449] underline underline-offset-4"
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
                <h1 className="text-3xl font-semibold text-[#1a2e1f]">Create an account</h1>
                <p className="text-sm text-[#6b7f6e]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-[#3d6449] underline underline-offset-4"
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
