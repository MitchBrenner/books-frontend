"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { LoginForm } from "@/components/forms/login-form";
import { supabase } from "@/lib/supabase/client";
import toast, { Toaster } from "react-hot-toast";

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
              <GoogleDivider />
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
              <GoogleDivider />
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

function GoogleDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs text-gray-400">or</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function GoogleButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
    >
      <GoogleIcon />
      {loading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
