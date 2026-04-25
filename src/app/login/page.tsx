import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Logo className="mx-auto mb-8 h-14 w-auto" />

        <div className="scoreboard-screen relative overflow-hidden rounded-xl border border-border-strong p-6">
          <h1 className="font-display text-lg uppercase tracking-[0.25em] led-text">Sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ll email you a one-time link. No password, no signup.
          </p>

          <div className="mt-6">
            {configured ? (
              <Suspense fallback={<div className="h-24" />}>
                <LoginForm />
              </Suspense>
            ) : (
              <div className="rounded-md border border-led-amber/30 bg-led-amber-deep/40 p-4 text-xs text-led-amber-soft">
                Auth isn&apos;t configured yet. Add{" "}
                <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
                <code className="font-mono">.env.local</code> and restart the dev server.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
