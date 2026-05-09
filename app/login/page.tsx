"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { LoginForm } from "@/components/forms/login-form";
import { supabase } from "@/lib/supabase/client";
import toast, { Toaster } from "react-hot-toast";
import { AuthDivider, GoogleButton } from "@/components/auth/oauth-buttons";

export function Login() {
  const [page, setPage] = useState<"login" | "create">("login");
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, []);

  async function handleGoogleSignIn() {
    setOauthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error("Failed to sign in with Google. Please try again.");
      setOauthLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />

      {/* Left panel — brand */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-black p-12 lg:flex lg:w-1/2">
        <div className="flex items-center gap-2.5">
          <BookOpen className="size-5 text-white" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-tight text-white">
            BetterBooks
          </span>
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
              <AuthDivider />
              <GoogleButton
                loading={oauthLoading}
                onClick={handleGoogleSignIn}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-black">
                  Create an account
                </h1>
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
              <AuthDivider />
              <GoogleButton
                loading={oauthLoading}
                onClick={handleGoogleSignIn}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
